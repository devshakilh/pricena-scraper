export interface ScraperSource {
  key: string;
  name: string;
  baseUrl: string;
  domain: string;
}

export const scraperSources: ScraperSource[] = [
  {
    key: 'daraz',
    name: 'Daraz',
    baseUrl: 'https://www.daraz.com.bd/catalog/?q=',
    domain: 'https://www.daraz.com.bd',
  },
  {
    key: 'chaldal',
    name: 'Chaldal',
    baseUrl: 'https://www.chaldal.com/search/',
    domain: 'https://www.chaldal.com',
  },
  {
    key: 'ajkerdeal',
    name: 'AjkerDeal',
    baseUrl: 'https://ajkerdeal.com/search?term=',
    domain: 'https://ajkerdeal.com',
  },
  {
    key: 'pickaboo',
    name: 'Pickaboo',
    baseUrl: 'https://www.pickaboo.com/search/?q=',
    domain: 'https://www.pickaboo.com',
  },
  {
    key: 'othoba',
    name: 'Othoba',
    baseUrl: 'https://www.othoba.com/search?q=',
    domain: 'https://www.othoba.com',
  },
  {
    key: 'bagdoom',
    name: 'Bagdoom',
    baseUrl: 'https://www.bagdoom.com/catalogsearch/result/?q=',
    domain: 'https://www.bagdoom.com',
  },
  {
    key: 'priyoshop',
    name: 'PriyoShop',
    baseUrl: 'https://priyoshop.com/search?term=',
    domain: 'https://priyoshop.com',
  },
  {
    key: 'shodagor',
    name: 'Shodagor',
    baseUrl: 'https://shodagor.com/?s=',
    domain: 'https://shodagor.com',
  },
  {
    key: 'rokomari',
    name: 'Rokomari',
    baseUrl: 'https://www.rokomari.com/search?term=',
    domain: 'https://www.rokomari.com',
  },
  {
    key: 'wafilife',
    name: 'Wafilife',
    baseUrl: 'https://www.wafilife.com/?s=',
    domain: 'https://www.wafilife.com',
  },
];