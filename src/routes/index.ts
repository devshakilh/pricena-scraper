import express from 'express';
import scraperRoutes from './scraper.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/scrape',
    route: scraperRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
