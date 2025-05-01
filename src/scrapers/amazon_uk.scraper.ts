/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */



import * as cheerio from 'cheerio';

import { Scraper } from '../interfaces/scraper.interface';
import { Product, ScraperResult } from '../interfaces/product.interface';
import logger from '../utils/logger';
import { ScraperError } from '../utils/scraperError';
import { fetchHtml } from '../utils/fetchHtml';
import { genId } from '../utils/genId';

export class AmazonUKScraper implements Scraper {
  private baseUrl: string;
  private domain: string;

  constructor(baseUrl: string, domain: string) {
    this.baseUrl = baseUrl;
    this.domain = domain;
  }

  async scrape(product: string): Promise<ScraperResult> {
    const url = `${this.baseUrl}${encodeURIComponent(product)}`;
    logger.info(`Scraping Amazon UK for product: ${product}`);

    try {
      const $ = await fetchHtml(url);
      const products: Product[] = [];
      const logo = $('.nav-logo-link img').attr('src') || 'logo not found';

      $('.s-result-item').each((_, element) => {
        const name = $(element).find('h2 a span').text().trim() || 'Name not found';
        const price = $(element).find('.a-price .a-offscreen').text().trim() || 'Price not available';
        const img = $(element).find('img.s-image').attr('src') || 'Image not found';

        
        let link =
          $(element).find('h2 a').attr('href') ||
          $(element).find('.s-product-image-container a').attr('href') ||
          'Link not found';

       
        if (link === 'Link not found') {
          logger.warn(`Product link not found for ${name} on Amazon UK`);
        } else if (link.startsWith('/')) {
          link = `${this.domain}${link}`;
        } else if (!link.startsWith('http')) {
          link = `${this.domain}/${link}`;
        }

        const id = genId();
        products.push({ id, name, price, img, link });
      });

      if (products.length === 0) {
        logger.warn(`No products found on Amazon UK for ${product}`);
      }

      logger.info(`Scraped ${products.length} products from Amazon UK`);
      return { name: 'Amazon UK', products, logo };
    } catch (error) {
      logger.error(`Failed to scrape Amazon UK for ${product}`, { error });
      throw new ScraperError(`Error scraping Amazon UK for ${product}`, error);
    }
  }
}