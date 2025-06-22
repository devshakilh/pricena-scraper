// import axios from 'axios';
// import * as cheerio from 'cheerio';
// import { ScraperError } from './scraperError';
// import logger from './logger';

// export async function fetchHtml(
//   url: string,
//   retries: number = 3
// ): Promise<cheerio.CheerioAPI> {
//   const headers = {
//     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
//     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
//     'Accept-Language': 'en-US,en;q=0.5',
//     'Connection': 'keep-alive',
//   };

//   for (let attempt = 1; attempt <= retries; attempt++) {
//     try {
//       logger.info(`Fetching HTML from ${url} (Attempt ${attempt})`);
//       const response = await axios.get(url, { 
//         headers,
//         timeout: 10000,
//         maxRedirects: 5,
//       });
//       const html = response.data;
//       if (typeof html !== 'string' || html.length < 100) {
//         throw new Error('Invalid or empty HTML response');
//       }
//       return cheerio.load(html);
//     } catch (error) {
//       if (attempt === retries) {
//         logger.error(
//           `Failed to fetch HTML from ${url} after ${retries} attempts`,
//           { error }
//         );
//         throw new ScraperError(`Failed to fetch HTML from ${url}`, error);
//       }
//       logger.warn(`Retrying fetch for ${url} (Attempt ${attempt} failed)`);
//       await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
//     }
//   }
//   throw new ScraperError(`Unexpected error fetching HTML from ${url}`);
// }

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';
import { ScraperError } from './scraperError';
import logger from './logger';

// Enable stealth mode to avoid bot detection
puppeteer.use(StealthPlugin());

export async function fetchHtml(
  url: string,
  retries: number = 3
): Promise<cheerio.CheerioAPI> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    let browser;
    try {
      logger.info(`Fetching HTML from ${url} (Attempt ${attempt})`);
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );
      // Handle redirects and verify final URL
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      const finalUrl = page.url();
      if (finalUrl !== url) {
        logger.warn(`Redirected to ${finalUrl} from ${url}`);
      }
      const html = await page.content();
      if (typeof html !== 'string' || html.length < 100) {
        throw new Error('Invalid or empty HTML response');
      }
      await browser.close();
      logger.info(`Successfully fetched HTML from ${url}`);
      return cheerio.load(html);
    } catch (error: unknown) {
      if (browser) await browser.close();
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      if (attempt === retries) {
        logger.error(
          `Failed to fetch HTML from ${url} after ${retries} attempts: ${errorMessage}`
        );
        throw new ScraperError(`Failed to fetch HTML from ${url}`, error);
      }
      logger.warn(
        `Retrying fetch for ${url} (Attempt ${attempt} failed: ${errorMessage})`
      );
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
  throw new ScraperError(`Unexpected error fetching HTML from ${url}`);
}