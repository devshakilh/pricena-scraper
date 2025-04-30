/* eslint-disable @typescript-eslint/no-unused-vars */

import { Product, ScraperResult } from './product.interface';

export interface Scraper {
  scrape(product: string): Promise<ScraperResult>;
}
