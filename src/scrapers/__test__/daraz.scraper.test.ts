
import * as cheerio from 'cheerio';
import { DarazScraper } from '../daraz.scraper';
import { fetchHtml } from '../../utils/fetchHtml';
import { genId } from '../../utils/genId';
import logger from '../../utils/logger';

jest.mock('../../utils/fetchHtml');
jest.mock('../../utils/genId');
jest.mock('../../utils/logger');

describe('DarazScraper', () => {
  const baseUrl = 'https://www.daraz.com.bd/catalog/?q=';
  const domain = 'https://www.daraz.com.bd';
  let scraper: DarazScraper;

  beforeEach(() => {
    scraper = new DarazScraper(baseUrl, domain);
    jest.clearAllMocks();
  });

  it('scrapes products successfully', async () => {
    const mockHtml = `
      <div class="logo"><img src="logo.png" /></div>
      <div class="gridItem--Yd0sa">
        <div class="title--wFj93"><a href="/phone">Phone</a></div>
        <div class="price--NVB62">৳80,000</div>
        <img class="image--WOyuZ" src="phone.jpg" />
      </div>
    `;
    (fetchHtml as jest.Mock).mockResolvedValue(cheerio.load(mockHtml));
    (genId as jest.Mock).mockReturnValue('123');

    const result = await scraper.scrape('phone');

    expect(result).toEqual({
      name: 'Daraz',
      logo: 'logo.png',
      products: [{ id: '123', name: 'Phone', price: '৳80,000', img: 'phone.jpg', link: `${domain}/phone` }],
    });
    expect(logger.info).toHaveBeenCalledWith('Scraped 1 products from Daraz');
  });

  it('handles no products', async () => {
    (fetchHtml as jest.Mock).mockResolvedValue(cheerio.load('<div class="logo"><img src="logo.png" /></div>'));
    const result = await scraper.scrape('empty');
    expect(result.products).toEqual([]);
    expect(logger.warn).toHaveBeenCalledWith('No products found on Daraz for empty');
  });

 
});