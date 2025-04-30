/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as cheerio from 'cheerio';

import { Scraper } from '../interfaces/scraper.interface';
import { Product, ScraperResult } from '../interfaces/product.interface';
import logger from '../utils/logger';
import { fetchHtml } from '../utils/fetchHtml';
import { genId } from '../utils/genId';

export class ShodagorScraper implements Scraper {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async scrape(product: string): Promise<ScraperResult> {
    const url = `${this.baseUrl}${encodeURIComponent(product)}`;
    logger.info(`Scraping Shodagor for product: ${product}`);

    try {
      const $ = await fetchHtml(url);
      const products: Product[] = [];
      const logo = $('.logo img').attr('src') || 'logo not found';

      $('.product-card').each((_, element) => {
        const name =
          $(element).find('.product-name').text().trim() || 'Name not found';
        const price =
          $(element).find('.product-price').text().trim() || 'Out Of Stock';
        const img =
          $(element).find('.product-img img').attr('src') || 'Image not found';
        const link =
          $(element).find('.product-link').attr('href') || 'Link not found';
        const id = genId();

        products.push({ id, name, price, img, link });
      });

      logger.info(`Scraped ${products.length} products from Shodagor`);
      return { name: 'Shodagor', products, logo };
    } catch (error) {
      logger.error(`Failed to scrape Shodagor for ${product}`, { error });
      throw new Error(`Error scraping Shodagor for ${product}`);
    }
  }
}
