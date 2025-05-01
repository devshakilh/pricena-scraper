
import * as cheerio from 'cheerio';
import { RokomariScraper } from '../rokomari.scraper';
import { fetchHtml } from '../../utils/fetchHtml';

jest.mock('../../utils/fetchHtml');

describe('RokomariScraper', () => {
  let scraper: RokomariScraper;

  beforeEach(() => {
    scraper = new RokomariScraper('https://www.rokomari.com/search?term=', 'https://www.rokomari.com');
  });

  it('should scrape products correctly', async () => {
    const mockHtml = `
      <div class="book-list-wrapper">
        <a class="book-title" href="/book/12345"><span>Test Book</span></a>
        <div class="book-price">TK. 1000</div>
        <div class="book-img"><img src="test.jpg"></div>
      </div>
    `;
    (fetchHtml as jest.Mock).mockResolvedValue(cheerio.load(mockHtml));

    const result = await scraper.scrape('test');
    expect(result.name).toBe('Rokomari');
    expect(result.products).toHaveLength(1);
    expect(result.products[0]).toEqual({
      id: expect.any(String),
      name: 'Test Book',
      price: 'TK. 1000',
      img: 'test.jpg',
      link: 'https://www.rokomari.com/book/12345',
    });
  });

  it('should handle no products found', async () => {
    (fetchHtml as jest.Mock).mockResolvedValue(cheerio.load('<div></div>'));

    const result = await scraper.scrape('test');
    expect(result.name).toBe('Rokomari');
    expect(result.products).toHaveLength(0);
  });
});