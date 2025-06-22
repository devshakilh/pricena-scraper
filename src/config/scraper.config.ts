export interface ScraperSource {
  key: string;
  name: string;
  baseUrl: string;
  domain: string;
}

export const scraperSources: ScraperSource[] = [
  // {
  //   key: 'daraz',
  //   name: 'Daraz',
  //   baseUrl: 'https://www.daraz.com.bd/catalog/?q=',
  //   domain: 'https://www.daraz.com.bd',
  // },
  // {
  //   key: 'chaldal',
  //   name: 'Chaldal',
  //   baseUrl: 'https://www.chaldal.com/search/',
  //   domain: 'https://www.chaldal.com',
  // },
  // {
  //   key: 'ajkerdeal',
  //   name: 'AjkerDeal',
  //   baseUrl: 'https://ajkerdeal.com/search?term=',
  //   domain: 'https://ajkerdeal.com',
  // },
  // {
  //   key: 'pickaboo',
  //   name: 'Pickaboo',
  //   baseUrl: 'https://www.pickaboo.com/search/?q=',
  //   domain: 'https://www.pickaboo.com',
  // },
  // {
  //   key: 'othoba',
  //   name: 'Othoba',
  //   baseUrl: 'https://www.othoba.com/search?q=',
  //   domain: 'https://www.othoba.com',
  // },
  // {
  //   key: 'bagdoom',
  //   name: 'Bagdoom',
  //   baseUrl: 'https://www.bagdoom.com/catalogsearch/result/?q=',
  //   domain: 'https://www.bagdoom.com',
  // },
  // {
  //   key: 'priyoshop',
  //   name: 'PriyoShop',
  //   baseUrl: 'https://priyoshop.com/search?term=',
  //   domain: 'https://priyoshop.com',
  // },
  // {
  //   key: 'shodagor',
  //   name: 'Shodagor',
  //   baseUrl: 'https://shodagor.com/?s=',
  //   domain: 'https://shodagor.com',
  // },
  {
    key: 'rokomari',
    name: 'Rokomari',
    baseUrl: 'https://www.rokomari.com/search?term=',
    domain: 'https://www.rokomari.com',
  },
  // {
  //   key: 'wafilife',
  //   name: 'Wafilife',
  //   baseUrl: 'https://www.wafilife.com/?s=',
  //   domain: 'https://www.wafilife.com',
  // },
  {
    key: 'amazon_uk',
    name: 'Amazon UK',
    baseUrl: 'https://www.amazon.co.uk/s?k=',
    domain: 'https://www.amazon.co.uk',
  },
  {
    key: 'ebay_uk',
    name: 'eBay UK',
    baseUrl: 'https://www.ebay.co.uk/sch/i.html?_nkw=',
    domain: 'https://www.ebay.co.uk',
  },
  // {
  //   key: 'tesco',
  //   name: 'Tesco',
  //   baseUrl: 'https://www.tesco.com/groceries/en-GB/search?query=',
  //   domain: 'https://www.tesco.com',
  // },
  // {
  //   key: 'sainsburys',
  //   name: 'Sainsbury’s',
  //   baseUrl: 'https://www.sainsburys.co.uk/shop/gb/groceries/search?query=',
  //   domain: 'https://www.sainsburys.co.uk',
  // },
  // {
  //   key: 'asda',
  //   name: 'Asda',
  //   baseUrl: 'https://www.asda.com/search?query=',
  //   domain: 'https://www.asda.com',
  // },
  {
    key: 'argos',
    name: 'Argos',
    baseUrl: 'https://www.argos.co.uk/search/',
    domain: 'https://www.argos.co.uk',
  },
  // {
  //   key: 'asos',
  //   name: 'ASOS',
  //   baseUrl: 'https://www.asos.com/search/?q=',
  //   domain: 'https://www.asos.com',
  // },
  // {
  //   key: 'marksandspencer',
  //   name: 'Marks & Spencer',
  //   baseUrl:
  //     'https://www.marksandspencer.com/webapp/wcs/stores/servlet/MSSearchCmd?storeId=10151&langId=-24&searchTerm=',
  //   domain: 'https://www.marksandspencer.com',
  // },
  // {
  //   key: 'next',
  //   name: 'Next',
  //   baseUrl: 'https://www.next.co.uk/search?w=',
  //   domain: 'https://www.next.co.uk',
  // },
  // {
  //   key: 'screwfix',
  //   name: 'Screwfix',
  //   baseUrl: 'https://www.screwfix.com/search?search=',
  //   domain: 'https://www.screwfix.com',
  // },
];
