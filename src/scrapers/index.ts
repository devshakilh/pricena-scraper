import { Scraper } from '../interfaces/scraper.interface';
import { DarazScraper } from './daraz.scraper';
import { ChaldalScraper } from './chaldal.scraper';
import { AjkerDealScraper } from './ajkerdeal.scraper';
import { PickabooScraper } from './pickaboo.scraper';
import { OthobaScraper } from './othoba.scraper';
import { BagdoomScraper } from './bagdoom.scraper';
import { PriyoShopScraper } from './priyoshop.scraper';
import { ShodagorScraper } from './shodagor.scraper';
import { RokomariScraper } from './rokomari.scraper';
import { WafilifeScraper } from './wafilife.scraper';
import { scraperSources } from '../config/scraper.config';

export const scrapers: Record<string, Scraper> = {
  daraz: new DarazScraper(scraperSources.find((s) => s.key === 'daraz')!.baseUrl),
  chaldal: new ChaldalScraper(scraperSources.find((s) => s.key === 'chaldal')!.baseUrl),
  ajkerdeal: new AjkerDealScraper(scraperSources.find((s) => s.key === 'ajkerdeal')!.baseUrl),
  pickaboo: new PickabooScraper(scraperSources.find((s) => s.key === 'pickaboo')!.baseUrl),
  othoba: new OthobaScraper(scraperSources.find((s) => s.key === 'othoba')!.baseUrl),
  bagdoom: new BagdoomScraper(scraperSources.find((s) => s.key === 'bagdoom')!.baseUrl),
  priyoshop: new PriyoShopScraper(scraperSources.find((s) => s.key === 'priyoshop')!.baseUrl),
  shodagor: new ShodagorScraper(scraperSources.find((s) => s.key === 'shodagor')!.baseUrl),
  rokomari: new RokomariScraper(scraperSources.find((s) => s.key === 'rokomari')!.baseUrl),
  wafilife: new WafilifeScraper(scraperSources.find((s) => s.key === 'wafilife')!.baseUrl),
};