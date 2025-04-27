/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as cheerio from 'cheerio';

import { Scraper } from '../interfaces/scraper.interface';
import { Product, ScraperResult } from '../interfaces/product.interface';
import logger from '../utils/logger';
import { ScraperError } from '../utils/scraperError';
import { fetchHtml } from '../utils/fetchHtml';
import { genId } from '../utils/genId';

export class PriyoShopScraper implements Scraper {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async scrape(product: string): Promise<ScraperResult> {
    const url = `${this.baseUrl}${encodeURIComponent(product)}`;
    logger.info(`Scraping PriyoShop for product: ${product}`);

    try {
      const $ = await fetchHtml(url);
      const products: Product[] = [];
      const logo = $('.logo img').attr('src') || 'logo not found';

      // Adjust selectors based on PriyoShop's actual HTML structure
      $('.product-item').each((_, element) => {
        const name = $(element).find('.product-title').text().trim() || 'Name not found';
        const price = $(element).find('.product-price').text().trim() || 'Out Of Stock';
        const img = $(element).find('.product-image img').attr('src') || 'Image not found';
        const link = $(element).find('.product-link').attr('href') || 'Link not found';
        const id = genId();

        products.push({ id, name, price, img, link });
      });

      if (products.length === 0) {
        logger.warn(`No products found on PriyoShop for ${product}`);
      }

      logger.info(`Scraped ${products.length} products from PriyoShop`);
      return { name: 'PriyoShop', products, logo };
    } catch (error) {
      logger.error(`Failed to scrape PriyoShop for ${product}`, { error });
      throw new ScraperError(`Error scraping PriyoShop for ${product}`, error);
    }
  }
}