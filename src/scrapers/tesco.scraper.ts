/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Scraper } from '../interfaces/scraper.interface';
import { Product, ScraperResult } from '../interfaces/product.interface';
import logger from '../utils/logger';
import { ScraperError } from '../utils/scraperError';
import fs from 'fs';
import path from 'path';

// Enable stealth mode
puppeteer.use(StealthPlugin());

export class TescoScraper implements Scraper {
  private baseUrl: string;
  private domain: string;

  constructor(
    baseUrl: string = 'https://www.tesco.com/groceries/en-GB/search?query=',
    domain: string = 'https://www.tesco.com'
  ) {
    this.baseUrl = baseUrl;
    this.domain = domain;
  }

  async scrape(product: string): Promise<ScraperResult> {
    const query = encodeURIComponent(
      product.replace(/\s+/g, '+').toLowerCase()
    );
    const url = `${this.baseUrl}${query}`;
    logger.info(`Scraping Tesco for product: ${product}, URL: ${url}`);

    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ],
      });
      const page = await browser.newPage();

      // Set browser-like headers and viewport
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );
      await page.setViewport({ width: 1280, height: 800 });

      // Log failed requests
      page.on('requestfailed', (request) => {
        logger.warn(
          `Request failed: ${request.url()} - ${request.failure()?.errorText}`
        );
      });

      // Navigate to the page
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Check for redirects
      const finalUrl = page.url();
      if (finalUrl !== url) {
        logger.warn(`Redirected to ${finalUrl} from ${url}`);
        throw new ScraperError(`Unexpected redirect to ${finalUrl}`, null);
      }

      // Check for CAPTCHA or verification
      const isCaptchaPresent =
        (await page.$(
          '[id*="captcha"], [class*="captcha"], [id*="verify"], [class*="verify"], [title*="robot"], [src*="recaptcha"]'
        )) !== null;
      if (isCaptchaPresent) {
        logger.error('CAPTCHA detected on Tesco page');
        throw new ScraperError('CAPTCHA detected, cannot scrape', null);
      }

      // Wait for product container or image
      const productContainerSelector =
        '.product-item, .product-list li, .product-grid-item'; // Update based on actual DOM
      await page
        .waitForSelector(productContainerSelector, { timeout: 40000 })
        .catch((err) => {
          logger.warn(
            'Product results container not found, page may not have loaded correctly',
            { error: err }
          );
        });

      // Scroll to trigger lazy-loading
      for (let i = 0; i < 8; i++) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
        await new Promise((resolve) => setTimeout(resolve, 4000));
      }

      // Save debug files
      const debugDir = path.join(__dirname, 'debug');
      if (!fs.existsSync(debugDir)) fs.mkdirSync(debugDir);
      const debugFile = `tesco_debug_${product.replace(/\s+/g, '_')}`;
      await page.screenshot({
        path: path.join(debugDir, `${debugFile}.png`),
        fullPage: true,
      });
      const html = await page.content();
      fs.writeFileSync(path.join(debugDir, `${debugFile}.html`), html);
      logger.info(
        `Saved debug screenshot to ${debugFile}.png and HTML to ${debugFile}.html`
      );

      // Evaluate page content
      const products: Product[] = await page.evaluate((domain) => {
        const items = document.querySelectorAll(
          '.product-item, .product-list li, .product-grid-item'
        );
        const results: Product[] = [];
        items.forEach((item, index) => {
          const name =
            item
              .querySelector('.product-title, .product-details a, .title')
              ?.textContent?.trim() || 'Name not found';
          const price =
            item
              .querySelector('.price, .price-container span, .price-value')
              ?.textContent?.trim() || 'Price not available';
          const img =
            item
              .querySelector('.product-image, .product-img img, img.product')
              ?.getAttribute('src') || 'Image not found';
          let link =
            item
              .querySelector(
                '.product-title, .product-details a, .product-link'
              )
              ?.getAttribute('href') || 'Link not found';

          // Log all items for debugging
          console.log(`Item ${index + 1}:`, { name, price, img, link });

          if (name !== 'Name not found' && link !== 'Link not found') {
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
            'img[alt*="Tesco" i], .header-logo img, .logo img, #logo img',
            (img) => (img as HTMLImageElement).src
          )) || 'Logo not found';
        if (logo !== 'Logo not found' && logo.startsWith('/')) {
          logo = `${this.domain}${logo}`;
        }
      } catch (e) {
        logger.warn('Failed to extract logo', { error: e });
      }

      if (products.length === 0) {
        logger.warn(
          `No valid products found on Tesco for ${product}. Check ${debugFile}.html for page content.`
        );
      } else {
        logger.info(
          `Scraped ${products.length} products from Tesco for ${product}`
        );
      }

      return { name: 'Tesco', products, logo };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      logger.error(`Failed to scrape Tesco for ${product}: ${errorMessage}`, {
        error,
        url,
      });
      throw new ScraperError(`Error scraping Tesco for ${product}`, error);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
