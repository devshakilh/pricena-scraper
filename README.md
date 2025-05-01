PricePoka Scraper API
A TypeScript-based web scraper API for fetching product data (name, price, image, link) from multiple e-commerce websites, including Rokomari and top UK platforms like Amazon UK, eBay UK, and others.
Features

Scrapes product details from 11 e-commerce sites.
Robust error handling with Winston logging.
TypeScript for type safety and maintainability.
Prettier and Husky for code formatting and linting.
pnpm for efficient package management.

Prerequisites

Node.js (>= 18.x)
pnpm (>= 8.x)

Installation

Clone the repository:git clone https://github.com/devshakilh/pricena-scraper
cd pricepoka-scraper


Install dependencies:pnpm install


Create a .env file:PORT=5000


Build the project:pnpm build



Usage

Start the server:pnpm start

Or for development with hot reload:pnpm dev


Access the API:curl http://localhost:5000/scrape/<product>

Example: curl http://localhost:5000/scrape/laptop

API Endpoint

GET /scrape/:product
Fetches product data from configured e-commerce sites.
Response: JSON array of site objects with product details.



Project Structure
pricepoka-scraper/
├── src/
│   ├── config/         # Scraper configurations
│   ├── controllers/    # API controllers
│   ├── interfaces/     # TypeScript interfaces
│   ├── middlewares/    # Middleware functions
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   ├── scrapers/       # Scraper implementations
│   ├── app.ts          # Express app setup
│   └── server.ts       # Server entry point
├── logs/               # Winston log files
├── .husky/             # Git hooks
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc
└── .env

Scripts

pnpm start: Run the built server.
pnpm dev: Run with hot reload.
pnpm build: Compile TypeScript to JavaScript.
pnpm lint: Run ESLint.
pnpm format: Run Prettier.

Debugging

Logs are stored in logs/app.log and logs/error.log.
Check HTML structure of target sites if data extraction fails (e.g., "Link not found").
Update selectors in src/scrapers/*.scraper.ts as needed.

Contributing

Fork the repository.
Create a feature branch: git checkout -b feature-name.
Commit changes: git commit -m "Add feature".
Push to the branch: git push origin feature-name.
Submit a pull request.


