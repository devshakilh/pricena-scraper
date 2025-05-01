import puppeteer from 'puppeteer';
import { Scraper } from '../interfaces/scraper.interface';
import { Product, ScraperResult } from '../interfaces/product.interface';
import logger from '../utils/logger';
import { ScraperError } from '../utils/scraperError';

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

    let browser;
    try {
      browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      );
      await page.goto(url, { waitUntil: 'networkidle2' });

      const products: Product[] = await page.evaluate((domain) => {
        const items = document.querySelectorAll('.s-result-item.s-asin');
        const results: Product[] = [];
        items.forEach((item) => {
          const name = item.querySelector('h2 a span')?.textContent?.trim();
          const price =
            item
              .querySelector('.a-price[data-a-size="xl"] .a-offscreen')
              ?.textContent?.trim() || 'Price not available';
          const img =
            (item.querySelector('.s-image') as HTMLImageElement)?.getAttribute(
              'src'
            ) || 'Image not found';
          let link =
            item.querySelector('h2 a')?.getAttribute('href') ||
            'Link not found';

          if (
            name &&
            link !== 'Link not found' &&
            !link.includes('/gp/bestsellers') &&
            !link.includes('/sspa/')
          ) {
            if (link.startsWith('/')) {
              link = `${domain}${link}`;
            } else if (!link.startsWith('http')) {
              link = `${domain}/${link}`;
            }
            const id = crypto.randomUUID();
            results.push({ id, name, price, img, link });
          }
        });
        return results;
      }, this.domain);

      const logo =
        (await page.$eval(
          '#nav-logo-sprites',
          (img) => (img as HTMLImageElement).src
        )) || 'logo not found';

      if (products.length === 0) {
        logger.warn(`No valid products found on Amazon UK for ${product}`);
      }

      logger.info(`Scraped ${products.length} products from Amazon UK`);
      return { name: 'Amazon UK', products, logo };
    } catch (error) {
      logger.error(`Failed to scrape Amazon UK for ${product}`, { error });
      throw new ScraperError(`Error scraping Amazon UK for ${product}`, error);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
