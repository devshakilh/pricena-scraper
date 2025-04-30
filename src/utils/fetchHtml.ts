import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScraperError } from './scraperError';
import logger from './logger';

export async function fetchHtml(
  url: string,
  retries: number = 3
): Promise<cheerio.CheerioAPI> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      logger.info(`Fetching HTML from ${url} (Attempt ${attempt})`);
      const response = await axios.get(url, { timeout: 10000 });
      return cheerio.load(response.data);
    } catch (error) {
      if (attempt === retries) {
        logger.error(
          `Failed to fetch HTML from ${url} after ${retries} attempts`,
          { error }
        );
        throw new ScraperError(`Failed to fetch HTML from ${url}`, error);
      }
      logger.warn(`Retrying fetch for ${url} (Attempt ${attempt} failed)`);
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
  throw new ScraperError(`Unexpected error fetching HTML from ${url}`);
}
