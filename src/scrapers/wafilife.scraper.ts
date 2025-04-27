/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as cheerio from 'cheerio';

import { Scraper } from '../interfaces/scraper.interface';
import { Product, ScraperResult } from '../interfaces/product.interface';
import logger from '../utils/logger';
import { fetchHtml } from '../utils/fetchHtml';
import { genId } from '../utils/genId';

export class WafilifeScraper implements Scraper {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async scrape(product: string): Promise<ScraperResult> {
    const url = `${this.baseUrl}${encodeURIComponent(product)}`;
    logger.info(`Scraping Wafilife for product: ${product}`);

    try {
      const $ = await fetchHtml(url);
      const products: Product[] = [];
      const logo = $('.logo img').attr('src') || 'logo not found';

      $('.product-item').each((_, element) => {
        const name = $(element).find('.product-title').text().trim() || 'Name not found';
        const price = $(element).find('.product-price').text().trim() || 'Out Of Stock';
        const img = $(element).find('.product-image img').attr('src') || 'Image not found';
        const link = $(element).find('.product-link').attr('href') || 'Link not found';
        const id = genId();

        products.push({ id, name, price, img, link });
      });

      logger.info(`Scraped ${products.length} products from Wafilife`);
      return { name: 'Wafilife', products, logo };
    } catch (error) {
      logger.error(`Failed to scrape Wafilife for ${product}`, { error });
      throw new Error(`Error scraping Wafilife for ${product}`);
    }
  }
}