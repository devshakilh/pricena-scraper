/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as cheerio from 'cheerio';
import { fetchHtml } from '../utils/fetchHtml';
import { genId } from '../utils/genId';
import { Scraper } from '../interfaces/scraper.interface';
import { Product, ScraperResult } from '../interfaces/product.interface';
import logger from '../utils/logger';
import { ScraperError } from '../utils/scraperError';

export class NextScraper implements Scraper {
  private baseUrl: string;
  private domain: string;

  constructor(baseUrl: string, domain: string) {
    this.baseUrl = baseUrl;
    this.domain = domain;
  }

  async scrape(product: string): Promise<ScraperResult> {
    const url = `${this.baseUrl}${encodeURIComponent(product)}`;
    logger.info(`Scraping Next for product: ${product}`);

    try {
      const $ = await fetchHtml(url);
      const products: Product[] = [];
      const logo = $('.next-logo img').attr('src') || 'logo not found';

      $('.ProductItem').each((_, element) => {
        const name = $(element).find('.ProductItem__title').text().trim() || 'Name not found';
        const price = $(element).find('.ProductItem__price').text().trim() || 'Price not available';
        const img = $(element).find('.ProductItem__image img').attr('src') || 'Image not found';

        let link =
          $(element).find('.ProductItem__link').attr('href') ||
          $(element).find('a').attr('href') ||
          'Link not found';

        if (link === 'Link not found') {
          logger.warn(`Product link not found for ${name} on Next`);
        } else if (link.startsWith('/')) {
          link = `${this.domain}${link}`;
        } else if (!link.startsWith('http')) {
          link = `${this.domain}/${link}`;
        }

        const id = genId();
        products.push({ id, name, price, img, link });
      });

      if (products.length === 0) {
        logger.warn(`No products found on Next for ${product}`);
      }

      logger.info(`Scraped ${products.length} products from Next`);
      return { name: 'Next', products, logo };
    } catch (error) {
      logger.error(`Failed to scrape Next for ${product}`, { error });
      throw new ScraperError(`Error scraping Next for ${product}`, error);
    }
  }
}