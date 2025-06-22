/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as cheerio from 'cheerio';
import { fetchHtml } from '../utils/fetchHtml';
import { genId } from '../utils/genId';
import { Scraper } from '../interfaces/scraper.interface';
import { Product, ScraperResult } from '../interfaces/product.interface';
import logger from '../utils/logger';
import { ScraperError } from '../utils/scraperError';
import fs from 'fs';

// Optional Puppeteer import (uncomment if needed)
// import puppeteer from 'puppeteer';

export class ArgosScraper implements Scraper {
  private baseUrl: string;
  private domain: string;

  constructor(
    baseUrl: string = 'https://www.argos.co.uk/search/',
    domain: string = 'https://www.argos.co.uk'
  ) {
    this.baseUrl = baseUrl;
    this.domain = domain;
  }

  async scrape(product: string): Promise<ScraperResult> {
    // Clean and encode product query
    const query = encodeURIComponent(
      product.replace(/\s+/g, '+').toLowerCase()
    );
    const url = `${this.baseUrl}${query}?clickOrigin=searchbar:home:searchterm:${query}`;
    logger.info(`Scraping Argos for product: ${product}, URL: ${url}`);

    try {
      // Fetch HTML content
      let $: cheerio.CheerioAPI;
      let rawHtml: string;

      try {
        $ = await fetchHtml(url);
        rawHtml = $.html();
      } catch (fetchError) {
        logger.error(`Failed to fetch HTML from ${url}`, { fetchError });
        throw new ScraperError(
          `Failed to fetch HTML for ${product}`,
          fetchError
        );
      }

      // Save raw HTML for debugging
      const debugFile = `argos_debug_${product.replace(/\s+/g, '_')}.html`;
      try {
        fs.writeFileSync(debugFile, rawHtml);
        logger.info(`Saved raw HTML to ${debugFile}`);
      } catch (writeError) {
        logger.warn(`Failed to save debug HTML`, { writeError });
      }

      // Verify page content
      if (!$('body').length) {
        logger.error('Empty or invalid HTML received');
        throw new ScraperError(
          'Empty or invalid HTML received from Argos',
          null
        );
      }

      const products: Product[] = [];
      let logo =
        $(
          '[data-test="argos-logo"] img, .argos-logo img, [alt*="argos" i] img, [class*="logo"] img'
        ).attr('src') || 'Logo not found';
      if (logo !== 'Logo not found' && logo.startsWith('/')) {
        logo = `${this.domain}${logo}`;
      }

      // Broad selectors for product cards
      const productCards = $(
        '[data-test="product-card"], .ProductCard, .xs-12--none, [class*="product"], [class*="card"], [data-component="product-card"], [data-product-id]'
      );
      logger.info(`Found ${productCards.length} potential product cards`);

      productCards.each((index, element) => {
        const name =
          $(element)
            .find(
              '[data-test="product-title"], .ProductCard__title, h2, h3, [class*="title"], [class*="name"], [itemprop="name"]'
            )
            .text()
            .trim() || 'Name not found';

        const priceElement = $(element)
          .find(
            '[data-test="product-price"], .ProductCard__price, [class*="price"], [class*="cost"], [itemprop="price"]'
          )
          .text()
          .trim();
        const price = priceElement
          ? this.cleanPrice(priceElement)
          : 'Price not available';

        let img =
          $(element)
            .find(
              '[data-test="product-image"] img, .ProductCard__image img, [class*="image"] img, [itemprop="image"]'
            )
            .attr('src') || 'Image not found';
        if (img !== 'Image not found' && img.startsWith('/')) {
          img = `${this.domain}${img}`;
        }

        let link =
          $(element)
            .find(
              '[data-test="product-link"], .ProductCard__link, a[class*="link"], a[itemprop="url"], a'
            )
            .attr('href') || 'Link not found';
        if (link !== 'Link not found') {
          link = link.startsWith('http')
            ? link
            : `${this.domain}${link.startsWith('/') ? link : `/${link}`}`;
        }

        // Skip invalid entries
        if (
          name === 'Name not found' &&
          price === 'Price not available' &&
          link === 'Link not found'
        ) {
          logger.warn(`Skipping invalid product at index ${index}`);
          return;
        }

        const id = genId();
        products.push({ id, name, price, img, link });
      });

      if (products.length === 0) {
        logger.warn(
          `No products found for ${product}. Possible reasons: incorrect selectors, dynamic content, or no results.`
        );
        logger.info(
          `Inspect ${debugFile} to verify HTML content. Consider using a headless browser for JavaScript-rendered content.`
        );
        // Optional: Uncomment to try Puppeteer fallback
        /*
        logger.info('Attempting Puppeteer fallback for dynamic content');
        $ = await this.fetchHtmlWithPuppeteer(url);
        // Repeat parsing logic with updated $
        productCards = $('[data-test="product-card"], .ProductCard, .xs-12--none, [class*="product"], [class*="card"], [data-component="product-card"], [data-product-id]');
        // ... (repeat parsing logic)
        */
      } else {
        logger.info(
          `Scraped ${products.length} products from Argos for ${product}`
        );
      }

      return { name: 'Argos', products, logo };
    } catch (error) {
      logger.error(`Failed to scrape Argos for ${product}`, { error, url });
      throw new ScraperError(`Error scraping Argos for ${product}`, error);
    }
  }

  // Clean price text
  private cleanPrice(price: string): string {
    if (!price) return 'Price not available';
    const cleaned = price.replace(/[^0-9.£€$]/g, '');
    return cleaned || 'Price not available';
  }

  // Optional Puppeteer fallback (uncomment and install puppeteer if needed)
  /*
  private async fetchHtmlWithPuppeteer(url: string): Promise<cheerio.CheerioAPI> {
    logger.info(`Using Puppeteer to fetch ${url}`);
    const browser = await puppeteer.launch({ headless: true });
    try {
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      const html = await page.content();
      await browser.close();
      // Save Puppeteer HTML for debugging
      fs.writeFileSync(`argos_puppeteer_debug_${url.split('/').pop()}.html`, html);
      return cheerio.load(html);
    } catch (error) {
      await browser.close();
      logger.error(`Puppeteer failed for ${url}`, { error });
      throw new ScraperError(`Puppeteer error for ${url}`, error);
    }
  }
  */
}
