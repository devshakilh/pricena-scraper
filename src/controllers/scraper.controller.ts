import { Request, Response } from 'express';
import { catchAsync } from '../middlewares/catchAsync';
import { sendResponse } from '../utils/sendResponse';
import { ScraperService } from '../services/scraper.service';
import { scraperSources } from '../config/scraper.config';

export class ScraperController {
  static getAllScrape = catchAsync(async (req: Request, res: Response) => {
    const product = req.params.product.replace(/\s+/g, '%20');
    const scrapers = await ScraperService.getAllScrape(product);

    const response = scraperSources.map(({ key, name }) => ({
      name,
      products: scrapers[key]?.products || [],
      logo: scrapers[key]?.logo || 'logo not found',
    }));

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Scraping data successfully',
      data: response,
    });
  });
}