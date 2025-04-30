/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as cheerio from 'cheerio';
import { fetchHtml } from '../utils/fetchHtml';

import { Scraper } from '../interfaces/scraper.interface';
import { Product, ScraperResult } from '../interfaces/product.interface';
import logger from '../utils/logger';
import { ScraperError } from '../utils/scraperError';
import { genId } from '../utils/genId';

export class AjkerDealScraper implements Scraper {
  private baseUrl: string;
  private domain: string;

  constructor(baseUrl: string, domain: string) {
    this.baseUrl = baseUrl;
    this.domain = domain;
  }

  async scrape(product: string): Promise<ScraperResult> {
    const url = `${this.baseUrl}${encodeURIComponent(product)}`;
    logger.info(`Scraping AjkerDeal for product: ${product}`);

    try {
      const $ = await fetchHtml(url);
      const products: Product[] = [];
      const logo = $('.logo img').attr('src') || 'logo not found';

      $('.product-item').each((_, element) => {
        const name =
          $(element).find('.product-title').text().trim() || 'Name not found';
        const price =
          $(element).find('.price-tag').text().trim() || 'Out Of Stock';
        const img =
          $(element).find('.product-img img').attr('src') || 'Image not found';
        let link =
          $(element).find('.product-link').attr('href') || 'Link not found';
        if (link.startsWith('/')) {
          link = `${this.domain}${link}`;
        } else if (!link.startsWith('http')) {
          link = `${this.domain}/${link}`;
        }

        const id = genId();
        products.push({ id, name, price, img, link });
      });

      if (products.length === 0) {
        logger.warn(`No products found on AjkerDeal for ${product}`);
      }

      logger.info(`Scraped ${products.length} products from AjkerDeal`);
      return { name: 'AjkerDeal', products, logo };
    } catch (error) {
      logger.error(`Failed to scrape AjkerDeal for ${product}`, { error });
      throw new ScraperError(`Error scraping AjkerDeal for ${product}`, error);
    }
  }
}
