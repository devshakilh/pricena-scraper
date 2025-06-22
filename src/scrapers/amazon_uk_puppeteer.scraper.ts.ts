import puppeteer from 'puppeteer';
import { Scraper } from '../interfaces/scraper.interface';
import { Product, ScraperResult } from '../interfaces/product.interface';
import logger from '../utils/logger';
import { ScraperError } from '../utils/scraperError';
import fs from 'fs';

export class AmazonUKScraper implements Scraper {
  private baseUrl: string;
  private domain: string;

  constructor(
    baseUrl: string = 'https://www.amazon.co.uk/s?k=',
    domain: string = 'https://www.amazon.co.uk'
  ) {
    this.baseUrl = baseUrl;
    this.domain = domain;
  }

  async scrape(product: string): Promise<ScraperResult> {
    // Clean and encode product query
    const query = encodeURIComponent(product.replace(/\s+/g, '+').toLowerCase());
    const url = `${this.baseUrl}${query}`;
    logger.info(`Scraping Amazon UK for product: ${product}, URL: ${url}`);

    let browser;
    try {
      // Launch Puppeteer with stealth options
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();

      // Set browser-like headers and viewport
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );
      await page.setViewport({ width: 1280, height: 800 });

      // Navigate to the page with extended timeout
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Check for CAPTCHA
      const isCaptchaPresent = await page.$('[id*="captcha"], [id*="captchacharacters"]') !== null;
      if (isCaptchaPresent) {
        logger.error('CAPTCHA detected on Amazon UK page');
        throw new ScraperError('CAPTCHA detected, cannot scrape', null);
      }

      // Wait for product results to load
      await page.waitForSelector('.s-main-slot', { timeout: 10000 }).catch(() => {
        logger.warn('Product results container not found, page may not have loaded correctly');
      });

      // Save screenshot and HTML for debugging
      const debugFile = `amazonuk_debug_${product.replace(/\s+/g, '_')}`;
      await page.screenshot({ path: `${debugFile}.png`, fullPage: true });
      const html = await page.content();
      fs.writeFileSync(`${debugFile}.html`, html);
      logger.info(`Saved debug screenshot to ${debugFile}.png and HTML to ${debugFile}.html`);

      // Evaluate page content
      const products: Product[] = await page.evaluate((domain) => {
        const items = document.querySelectorAll(
          '.s-result-item.s-asin, [data-component-type="s-search-result"], [data-asin]'
        );
        const results: Product[] = [];
        items.forEach((item) => {
          const name =
            item.querySelector('h2 a span, [class*="title"] span, [class*="product-title"]')?.textContent?.trim() ||
            'Name not found';
          const price =
            item
              .querySelector(
                '.a-price[data-a-size="xl"] .a-offscreen, .a-price-whole, [class*="price"], [data-a-price]'
              )
              ?.textContent?.trim() || 'Price not available';
          const img =
            item.querySelector('.s-image, [class*="image"] img, img[data-image-source]')?.getAttribute('src') ||
            'Image not found';
          let link =
            item.querySelector('h2 a, [class*="title"] a, a[href*="/dp/"]')?.getAttribute('href') ||
            'Link not found';

          if (
            name &&
            name !== 'Name not found' &&
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

      // Extract logo
      let logo = 'Logo not found';
      try {
        logo =
          (await page.$eval(
            '#nav-logo-sprites, [id*="logo"] img, [alt*="amazon" i], img[src*="logo"]',
            (img) => (img as HTMLImageElement).src
          )) || 'Logo not found';
        if (logo !== 'Logo not found' && logo.startsWith('/')) {
          logo = `${this.domain}${logo}`;
        }
      } catch (e) {
        logger.warn('Failed to extract logo', { error: e });
      }

      if (products.length === 0) {
        logger.warn(`No valid products found on Amazon UK for ${product}. Check ${debugFile}.html for page content.`);
      } else {
        logger.info(`Scraped ${products.length} products from Amazon UK for ${product}`);
      }

      return { name: 'Amazon UK', products, logo };
    } catch (error) {
      logger.error(`Failed to scrape Amazon UK for ${product}`, { error, url });
      throw new ScraperError(`Error scraping Amazon UK for ${product}`, error);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}