import { scraperSources } from '../config/scraper.config';
import { ScraperResult } from '../interfaces/product.interface';
import { scrapers } from '../scrapers';
import logger from '../utils/logger';

export class ScraperService {
  static async getAllScrape(product: string): Promise<Record<string, ScraperResult>> {
    const scraperPromises = Object.entries(scrapers).map(async ([key, scraper]) => {
      try {
        const result = await scraper.scrape(product);
        return { key, result };
      } catch (error) {
        logger.error(`Scraper ${key} failed for product ${product}`, { error });
        return { key, result: { name: scraperSources.find((s) => s.key === key)!.name, products: [], logo: 'error' } };
      }
    });

    const results = await Promise.all(scraperPromises);

    return results.reduce((acc, { key, result }) => {
      acc[key] = result;
      return acc;
    }, {} as Record<string, ScraperResult>);
  }
}