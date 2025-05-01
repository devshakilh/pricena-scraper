/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */


import * as cheerio from 'cheerio';

import { Scraper } from '../interfaces/scraper.interface';
import { Product, ScraperResult } from '../interfaces/product.interface';
import logger from '../utils/logger';
import { ScraperError } from '../utils/scraperError';
import { fetchHtml } from '../utils/fetchHtml';
import { genId } from '../utils/genId';

export class TescoScraper implements Scraper {
  private baseUrl: string;
  private domain: string;

  constructor(baseUrl: string, domain: string) {
    this.baseUrl = baseUrl;
    this.domain = domain;
  }

  async scrape(product: string): Promise<ScraperResult> {
    const url = `${this.baseUrl}${encodeURIComponent(product)}`;
    logger.info(`Scraping Tesco for product: ${product}`);

    try {
      const $ = await fetchHtml(url);
      const products: Product[] = [];
      const logo = $('.tesco-logo img').attr('src') || 'logo not found';

      $('.product-tile').each((_, element) => {
        const name = $(element).find('.product-title').text().trim() || 'Name not found';
        const price = $(element).find('.price').text().trim() || 'Price not available';
        const img = $(element).find('.product-image img').attr('src') || 'Image not found';

        let link =
          $(element).find('a.product-link').attr('href') ||
          $(element).find('a').attr('href') ||
          'Link not found';

        if (link === 'Link not found') {
          logger.warn(`Product link not found for ${name} on Tesco`);
        } else if (link.startsWith('/')) {
          link = `${this.domain}${link}`;
        } else if (!link.startsWith('http')) {
          link = `${this.domain}/${link}`;
        }

        const id = genId();
        products.push({ id, name, price, img, link });
      });

      if (products.length === 0) {
        logger.warn(`No products found on Tesco for ${product}`);
      }

      logger.info(`Scraped ${products.length} products from Tesco`);
      return { name: 'Tesco', products, logo };
    } catch (error) {
      logger.error(`Failed to scrape Tesco for ${product}`, { error });
      throw new ScraperError(`Error scraping Tesco for ${product}`, error);
    }
  }
}