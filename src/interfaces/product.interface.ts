export interface Product {
    id: string;
    name: string;
    price: string;
    img: string;
    link: string;
  }
  
  export interface ScraperResult {
    name: string;
    products: Product[];
    logo: string;
  }