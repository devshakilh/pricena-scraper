// eslint-disable-next-line @typescript-eslint/no-explicit-any

import puppeteer from 'puppeteer';
import { AmazonUKScraper } from '../amazon_uk_puppeteer.scraper.ts';
import { ScraperResult } from '../../interfaces/product.interface.js';

jest.mock('puppeteer');

const mockedPuppeteer = puppeteer as jest.Mocked<typeof puppeteer>;

describe('AmazonUKScraper', () => {
  const baseUrl = 'https://www.amazon.co.uk/s?k=';
  const domain = 'https://www.amazon.co.uk';
  const scraper = new AmazonUKScraper(baseUrl, domain);

  const mockPage = {
    setUserAgent: jest.fn(),
    goto: jest.fn(),
    evaluate: jest.fn(),
    $eval: jest.fn(),
  };

  const mockBrowser = {
    newPage: jest.fn().mockResolvedValue(mockPage),
    close: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedPuppeteer.launch.mockResolvedValue(mockBrowser as any);
  });

  it('should scrape product data and return valid results', async () => {
    const mockProducts = [
      {
        id: '123',
        name: 'Test Laptop',
        price: '£999',
        img: 'https://example.com/image.jpg',
        link: 'https://www.amazon.co.uk/product/123',
      },
    ];

    mockPage.evaluate.mockResolvedValue(mockProducts);
    mockPage.$eval.mockResolvedValue('https://amazon-logo.com/logo.png');

    const result: ScraperResult = await scraper.scrape('laptop');

    expect(result.name).toBe('Amazon UK');
    expect(result.products).toEqual(mockProducts);
    expect(result.logo).toBe('https://amazon-logo.com/logo.png');
    expect(mockPage.goto).toHaveBeenCalled();
    expect(mockBrowser.close).toHaveBeenCalled();
  });

  it('should handle errors and throw ScraperError', async () => {
    mockedPuppeteer.launch.mockRejectedValue(new Error('Browser failed'));

    await expect(scraper.scrape('phone')).rejects.toThrow(
      'Error scraping Amazon UK for phone'
    );
  });
});
