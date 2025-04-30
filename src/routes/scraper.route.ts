import express from 'express';
import { ScraperController } from '../controllers/scraper.controller';

const router = express.Router();

router.get('/:product', ScraperController.getAllScrape);

export default router;
