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

export class DarazScraper implements Scraper {
  private baseUrl: string;
  private domain: string;

  constructor(
    baseUrl: string = 'https://www.daraz.com.bd/catalog/?q=',
    domain: string = 'https://www.daraz.com.bd'
  ) {
    this.baseUrl = baseUrl;
    this.domain = domain;
  }

  async scrape(product: string): Promise<ScraperResult> {
    const query = encodeURIComponent(product.replace(/\s+/g, '+').toLowerCase());
    const url = `${this.baseUrl}${query}`;
    logger.info(`Scraping Daraz for product: ${product}, URL: ${url}`);

    let browser;
    try {
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

      // Navigate to the page
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Check for CAPTCHA or verification
      const isCaptchaPresent = await page.$(
        '[id*="captcha"], [class*="captcha"], [id*="verify"], [class*="verify"], [title*="robot"], [src*="recaptcha"]'
      ) !== null;
      if (isCaptchaPresent) {
        logger.error('CAPTCHA detected on Daraz page');
        throw new ScraperError('CAPTCHA detected, cannot scrape', null);
      }

      // Scroll multiple times to load all products
      for (let i = 0; i < 5; i++) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      // Wait for product results
      const productSelector =
        '.gridItem--Yd0sa, .card-jfy-item, [class*="card"], [class*="item"], [class*="product"], [data-qa-locator="product-item"], [class*="product-card"]';
      await page.waitForSelector(productSelector, { timeout: 30000 }).catch(() => {
        logger.warn('Product results container not found, page may not have loaded correctly');
      });

      // Save debug files
      const debugDir = path.join(__dirname, 'debug');
      if (!fs.existsSync(debugDir)) fs.mkdirSync(debugDir);
      const debugFile = `daraz_debug_${product.replace(/\s+/g, '_')}`;
      await page.screenshot({ path: path.join(debugDir, `${debugFile}.png`), fullPage: true });
      const html = await page.content();
      fs.writeFileSync(path.join(debugDir, `${debugFile}.html`), html);
      logger.info(`Saved debug screenshot to ${debugFile}.png and HTML to ${debugFile}.html`);

      // Evaluate page content
      const products: Product[] = await page.evaluate((domain) => {
        const items = document.querySelectorAll(
          '.gridItem--Yd0sa, .card-jfy-item, [class*="card"], [class*="item"], [class*="product"], [data-qa-locator="product-item"], [class*="product-card"]'
        );
        const results: Product[] = [];
        items.forEach((item, index) => {
          const name =
            item.querySelector(
              '.title--wFj93, .title, [class*="title"], [class*="name"], h3, h2, [class*="product-name"], .name'
            )?.textContent?.trim() || 'Name not found';
          const price =
            item
              .querySelector(
                '.price--NVB62, .current-price, [class*="price"], [class*="cost"], .currency, [class*="price-container"], .sale-price'
              )
              ?.textContent?.trim() || 'Out Of Stock';
          const img =
            item.querySelector(
              '.img--VQr82, .main-pic, [class*="image"] img, img[src*="product"], [class*="img"], .image'
            )?.getAttribute('src') || 'Image not found';
          let link =
            item.querySelector(
              '.title--wFj93 a, .title a, [class*="title"] a, a[href*="/products/"], [class*="link"], .link'
            )?.getAttribute('href') || 'Link not found';

          // Log all items for debugging
          console.log(`Item ${index + 1}:`, { name, price, img, link });

          // Relaxed filtering to include products with valid name or link
          if (name !== 'Name not found' || link !== 'Link not found') {
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
            '.rax-image, [id*="logo"] img, [alt*="daraz" i], img[src*="logo"], [class*="logo"] img, .logo img',
            (img) => (img as HTMLImageElement).src
          )) || 'Logo not found';
        if (logo !== 'Logo not found' && logo.startsWith('/')) {
          logo = `${this.domain}${logo}`;
        }
      } catch (e) {
        logger.warn('Failed to extract logo', { error: e });
      }

      if (products.length === 0) {
        logger.warn(`No valid products found on Daraz for ${product}. Check ${debugFile}.html for page content.`);
        throw new ScraperError(
          `No products found for ${product}. Check selectors or JavaScript rendering.`
        );
      }

      logger.info(`Scraped ${products.length} products from Daraz for ${product}`);
      return { name: 'Daraz', products, logo };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      logger.error(`Failed to scrape Daraz for ${product}: ${errorMessage}`, { error, url });
      throw new ScraperError(`Error scraping Daraz for ${product}`, error);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}