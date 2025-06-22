import { Scraper } from '../interfaces/scraper.interface';

import { RokomariScraper } from './rokomari.scraper';

import { scraperSources } from '../config/scraper.config';

import { eBayUKScraper } from './ebay_uk.scraper';

import { ArgosScraper } from './argos.scraper';

import { AmazonUKScraper } from './amazon_uk_puppeteer.scraper.ts';

export const scrapers: Record<string, Scraper> = {
  // daraz: new DarazScraper(
  //   scraperSources.find((s) => s.key === 'daraz')!.baseUrl,
  //   scraperSources.find((s) => s.key === 'daraz')!.domain
  // ),
  // chaldal: new ChaldalScraper(
  //   scraperSources.find((s) => s.key === 'chaldal')!.baseUrl,
  //   scraperSources.find((s) => s.key === 'chaldal')!.domain
  // ),
  // ajkerdeal: new AjkerDealScraper(
  //   scraperSources.find((s) => s.key === 'ajkerdeal')!.baseUrl,
  //   scraperSources.find((s) => s.key === 'ajkerdeal')!.domain
  // ),
  // pickaboo: new PickabooScraper(
  //   scraperSources.find((s) => s.key === 'pickaboo')!.baseUrl,
  //   scraperSources.find((s) => s.key === 'pickaboo')!.domain
  // ),
  // othoba: new OthobaScraper(
  //   scraperSources.find((s) => s.key === 'othoba')!.baseUrl,
  //   scraperSources.find((s) => s.key === 'othoba')!.domain
  // ),
  // bagdoom: new BagdoomScraper(
  //   scraperSources.find((s) => s.key === 'bagdoom')!.baseUrl,
  //   scraperSources.find((s) => s.key === 'bagdoom')!.domain
  // ),
  // priyoshop: new PriyoShopScraper(
  //   scraperSources.find((s) => s.key === 'priyoshop')!.baseUrl,
  //   scraperSources.find((s) => s.key === 'priyoshop')!.domain
  // ),
  // shodagor: new ShodagorScraper(
  //   scraperSources.find((s) => s.key === 'shodagor')!.baseUrl,
  //   scraperSources.find((s) => s.key === 'shodagor')!.domain
  // ),
  rokomari: new RokomariScraper(
    scraperSources.find((s) => s.key === 'rokomari')!.baseUrl,
    scraperSources.find((s) => s.key === 'rokomari')!.domain
  ),
  // wafilife: new WafilifeScraper(
  //   scraperSources.find((s) => s.key === 'wafilife')!.baseUrl,
  //   scraperSources.find((s) => s.key === 'wafilife')!.domain
  // ),
  amazon_uk: new AmazonUKScraper(
    scraperSources.find((s) => s.key === 'amazon_uk')!.baseUrl,
    scraperSources.find((s) => s.key === 'amazon_uk')!.domain
  ),
  ebay_uk: new eBayUKScraper(
    scraperSources.find((s) => s.key === 'ebay_uk')!.baseUrl,
    scraperSources.find((s) => s.key === 'ebay_uk')!.domain
  ),
  // tesco: new TescoScraper(
  //   scraperSources.find((s) => s.key === 'tesco')!.baseUrl,
  //   scraperSources.find((s) => s.key === 'tesco')!.domain
  // ),
  // sainsburys: new SainsburysScraper(
  //   scraperSources.find((s) => s.key === 'sainsburys')!.baseUrl,
  //   scraperSources.find((s) => s.key === 'sainsburys')!.domain
  // ),
  // asda: new AsdaScraper(
  //   scraperSources.find((s) => s.key === 'asda')!.baseUrl,
  //   scraperSources.find((s) => s.key === 'asda')!.domain
  // ),
  argos: new ArgosScraper(
    scraperSources.find((s) => s.key === 'argos')!.baseUrl,
    scraperSources.find((s) => s.key === 'argos')!.domain
  ),
  // asos: new ASOSScraper(
  //   scraperSources.find((s) => s.key === 'asos')!.baseUrl,
  //   scraperSources.find((s) => s.key === 'asos')!.domain
  // ),
  // marksandspencer: new MarksAndSpencerScraper(
  //   scraperSources.find((s) => s.key === 'marksandspencer')!.baseUrl,
  //   scraperSources.find((s) => s.key === 'marksandspencer')!.domain
  // ),
  // next: new NextScraper(
  //   scraperSources.find((s) => s.key === 'next')!.baseUrl,
  //   scraperSources.find((s) => s.key === 'next')!.domain
  // ),
  // screwfix: new ScrewfixScraper(
  //   scraperSources.find((s) => s.key === 'screwfix')!.baseUrl,
  //   scraperSources.find((s) => s.key === 'screwfix')!.domain
  // ),
};
