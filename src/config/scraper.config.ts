export interface ScraperSource {
    key: string;
    name: string;
    baseUrl: string;
  }
  
  export const scraperSources: ScraperSource[] = [
    { key: 'daraz', name: 'Daraz', baseUrl: 'https://www.daraz.com.bd/catalog/?q=' },
    { key: 'chaldal', name: 'Chaldal', baseUrl: 'https://www.chaldal.com/search/' },
    { key: 'ajkerdeal', name: 'AjkerDeal', baseUrl: 'https://ajkerdeal.com/search?term=' },
    { key: 'pickaboo', name: 'Pickaboo', baseUrl: 'https://www.pickaboo.com/search/?q=' },
    { key: 'othoba', name: 'Othoba', baseUrl: 'https://www.othoba.com/search?q=' },
    { key: 'bagdoom', name: 'Bagdoom', baseUrl: 'https://www.bagdoom.com/catalogsearch/result/?q=' },
    { key: 'priyoshop', name: 'PriyoShop', baseUrl: 'https://priyoshop.com/search-results?q=' },
    { key: 'shodagor', name: 'Shodagor', baseUrl: 'https://shodagor.com/?s=' },
    { key: 'rokomari', name: 'Rokomari', baseUrl: 'https://www.rokomari.com/search?term=' },
    { key: 'wafilife', name: 'Wafilife', baseUrl: 'https://www.wafilife.com/?s=' },
  ];