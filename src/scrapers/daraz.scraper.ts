/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as cheerio from 'cheerio';

import { genId } from '../utils/genId';
import { Scraper } from '../interfaces/scraper.interface';
import { Product, ScraperResult } from '../interfaces/product.interface';

import { fetchHtml } from '../utils/fetchHtml';
import logger from '../utils/logger';

export class DarazScraper implements Scraper {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async scrape(product: string): Promise<ScraperResult> {
    const url = `${this.baseUrl}${encodeURIComponent(product)}`;
    logger.info(`Scraping Daraz for product: ${product}`);

    try {
      const $ = await fetchHtml(url);
      const products: Product[] = [];
      const logo = $('.logo img').attr('src') || 'logo not found';

      $('.gridItem--Yd0sa').each((_, element) => {
        const name = $(element).find('.title--wFj93').text().trim() || 'Name not found';
        const price = $(element).find('.price--NVB62').text().trim() || 'Out Of Stock';
        const img = $(element).find('.image--WOyuZ').attr('src') || 'Image not found';
        const link = $(element).find('.title--wFj93 a').attr('href') || 'Link not found';
        const id = genId();

        products.push({ id, name, price, img, link });
      });

      logger.info(`Scraped ${products.length} products from Daraz`);
      return { name: 'Daraz', products, logo };
    } catch (error) {
      logger.error(`Failed to scrape Daraz for ${product}`, { error });
      throw new Error(`Error scraping Daraz for ${product}`);
    }
  }
}