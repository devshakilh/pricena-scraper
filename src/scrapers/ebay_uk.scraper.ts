/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */


import * as cheerio from 'cheerio';

import { Scraper } from '../interfaces/scraper.interface';
import { Product, ScraperResult } from '../interfaces/product.interface';
import logger from '../utils/logger';
import { ScraperError } from '../utils/scraperError';
import { fetchHtml } from '../utils/fetchHtml';
import { genId } from '../utils/genId';

export class eBayUKScraper implements Scraper {
  private baseUrl: string;
  private domain: string;

  constructor(baseUrl: string, domain: string) {
    this.baseUrl = baseUrl;
    this.domain = domain;
  }

  async scrape(product: string): Promise<ScraperResult> {
    const url = `${this.baseUrl}${encodeURIComponent(product)}`;
    logger.info(`Scraping eBay UK for product: ${product}`);

    try {
      const $ = await fetchHtml(url);
      const products: Product[] = [];
      const logo = $('.ebay-logo img').attr('src') || 'logo not found';

      $('.s-item').each((_, element) => {
        const name = $(element).find('.s-item__title').text().trim() || 'Name not found';
        const price = $(element).find('.s-item__price').text().trim() || 'Price not available';
        const img = $(element).find('.s-item__image img').attr('src') || 'Image not found';

        let link =
          $(element).find('.s-item__link').attr('href') ||
          $(element).find('a').attr('href') ||
          'Link not found';

        if (link === 'Link not found') {
          logger.warn(`Product link not found for ${name} on eBay UK`);
        } else if (link.startsWith('/')) {
          link = `${this.domain}${link}`;
        } else if (!link.startsWith('http')) {
          link = `${this.domain}/${link}`;
        }

        const id = genId();
        products.push({ id, name, price, img, link });
      });

      if (products.length === 0) {
        logger.warn(`No products found on eBay UK for ${product}`);
      }

      logger.info(`Scraped ${products.length} products from eBay UK`);
      return { name: 'eBay UK', products, logo };
    } catch (error) {
      logger.error(`Failed to scrape eBay UK for ${product}`, { error });
      throw new ScraperError(`Error scraping eBay UK for ${product}`, error);
    }
  }
}