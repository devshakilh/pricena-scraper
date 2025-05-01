/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as cheerio from 'cheerio';

import { Scraper } from '../interfaces/scraper.interface';
import { Product, ScraperResult } from '../interfaces/product.interface';
import logger from '../utils/logger';
import { ScraperError } from '../utils/scraperError';
import { fetchHtml } from '../utils/fetchHtml';
import { genId } from '../utils/genId';

export class RokomariScraper implements Scraper {
  private baseUrl: string;
  private domain: string;

  constructor(baseUrl: string, domain: string) {
    this.baseUrl = baseUrl;
    this.domain = domain;
  }

  async scrape(product: string): Promise<ScraperResult> {
    const url = `${this.baseUrl}${encodeURIComponent(product)}`;
    logger.info(`Scraping Rokomari for product: ${product}`);

    try {
      const $ = await fetchHtml(url);
      const products: Product[] = [];
      const logo = $('.logo img').attr('src') || 'logo not found';

      $('.book-list-wrapper').each((_, element) => {
        const name = $(element).find('.book-title').text().trim() || 'Name not found';
        const price = $(element).find('.book-price').text().trim() || 'Out Of Stock';
        const img = $(element).find('.book-img img').attr('src') || 'Image not found';
        
        // Try multiple selectors for the product link
        let link = $(element).find('.book-title a').attr('href') ||
                   $(element).find('.book-img a').attr('href') ||
                   $(element).find('.product-link').attr('href') ||
                   'Link not found';

        // Ensure absolute URL
        if (link === 'Link not found') {
          logger.warn(`Product link not found for ${name} on Rokomari`);
        } else if (link.startsWith('/')) {
          link = `${this.domain}${link}`;
        } else if (!link.startsWith('http')) {
          link = `${this.domain}/${link}`;
        }

        const id = genId();
        products.push({ id, name, price, img, link });
      });

      if (products.length === 0) {
        logger.warn(`No products found on Rokomari for ${product}`);
      }

      logger.info(`Scraped ${products.length} products from Rokomari`);
      return { name: 'Rokomari', products, logo };
    } catch (error) {
      logger.error(`Failed to scrape Rokomari for ${product}`, { error });
      throw new ScraperError(`Error scraping Rokomari for ${product}`, error);
    }
  }
}