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
  daraz: new DarazScraper(
    scraperSources.find((s) => s.key === 'daraz')!.baseUrl,
    scraperSources.find((s) => s.key === 'daraz')!.domain
  ),
  chaldal: new ChaldalScraper(
    scraperSources.find((s) => s.key === 'chaldal')!.baseUrl,
    scraperSources.find((s) => s.key === 'chaldal')!.domain
  ),
  ajkerdeal: new AjkerDealScraper(
    scraperSources.find((s) => s.key === 'ajkerdeal')!.baseUrl,
    scraperSources.find((s) => s.key === 'ajkerdeal')!.domain
  ),
  pickaboo: new PickabooScraper(
    scraperSources.find((s) => s.key === 'pickaboo')!.baseUrl,
    scraperSources.find((s) => s.key === 'pickaboo')!.domain
  ),
  othoba: new OthobaScraper(
    scraperSources.find((s) => s.key === 'othoba')!.baseUrl,
    scraperSources.find((s) => s.key === 'othoba')!.domain
  ),
  bagdoom: new BagdoomScraper(
    scraperSources.find((s) => s.key === 'bagdoom')!.baseUrl,
    scraperSources.find((s) => s.key === 'bagdoom')!.domain
  ),
  priyoshop: new PriyoShopScraper(
    scraperSources.find((s) => s.key === 'priyoshop')!.baseUrl,
    scraperSources.find((s) => s.key === 'priyoshop')!.domain
  ),
  shodagor: new ShodagorScraper(
    scraperSources.find((s) => s.key === 'shodagor')!.baseUrl,
    scraperSources.find((s) => s.key === 'shodagor')!.domain
  ),
  rokomari: new RokomariScraper(
    scraperSources.find((s) => s.key === 'rokomari')!.baseUrl,
    scraperSources.find((s) => s.key === 'rokomari')!.domain
  ),
  wafilife: new WafilifeScraper(
    scraperSources.find((s) => s.key === 'wafilife')!.baseUrl,
    scraperSources.find((s) => s.key === 'wafilife')!.domain
  ),
};
