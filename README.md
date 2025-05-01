
# 📦 PricePoka Scraper API

A **TypeScript-based web scraper API** for fetching product data (name, price, image, and link) from multiple e-commerce websites, including **Rokomari** and popular **UK platforms** like **Amazon UK**, **eBay UK**, **Tesco**, and more.

---

## ✨ Features

- 🔍 Scrapes product details from **11+ e-commerce sites**
- ⚙️ Robust error handling with **Winston logging**
- 🔐 Fully typed with **TypeScript** for maintainability
- 🎨 Code quality enforced via **Prettier**, **ESLint**, and **Husky hooks**
- ⚡ Uses **pnpm** for fast and reliable package management

---

## 📦 Prerequisites

- [Node.js](https://nodejs.org/) (>= 18.x)
- [pnpm](https://pnpm.io/) (>= 8.x)

---

## 🚀 Installation

```bash
# Clone the repository
git clone <repository-url>
cd pricepoka-scraper

# Install dependencies
pnpm install

# Create a .env file
echo "PORT=5000" > .env

# Build the project
pnpm build
```

---

## 🔧 Usage

```bash
# Start the production server
pnpm start

# OR start in development mode with hot reload
pnpm dev
```

### ✅ Example API Call

```bash
curl http://localhost:5000/scrape/laptop
```

---

## 🌐 API Endpoint

### `GET /scrape/:product`

Fetches product data from all configured e-commerce platforms.

**Response (JSON):**
```json
[
  {
    "name": "Amazon UK",
    "logo": "https://...logo.png",
    "products": [
      {
        "id": "uuid",
        "name": "Product Title",
        "price": "$99.99",
        "img": "https://...image.jpg",
        "link": "https://...product-url"
      }
    ]
  },
  ...
]
```

---

## 🗂️ Project Structure

```
pricepoka-scraper/
├── src/
│   ├── config/         # Scraper configurations
│   ├── controllers/    # API logic
│   ├── interfaces/     # TypeScript interfaces
│   ├── middlewares/    # Middleware functions
│   ├── routes/         # API routes
│   ├── services/       # Scraper services
│   ├── utils/          # Utility functions
│   ├── scrapers/       # Individual scraper implementations
│   ├── app.ts          # Express app setup
│   └── server.ts       # Entry point
├── logs/               # Winston log output
├── .husky/             # Git hooks
├── .env                # Environment config
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc
```

---

## 🛠 Scripts

| Script         | Description                    |
|----------------|--------------------------------|
| `pnpm start`   | Run the production server      |
| `pnpm dev`     | Start dev server with hot reload |
| `pnpm build`   | Compile TypeScript             |
| `pnpm lint`    | Run ESLint                     |
| `pnpm format`  | Format code with Prettier      |

---

## 🐛 Debugging

- All logs are saved in:
  - `logs/app.log` (general logs)
  - `logs/error.log` (errors)
- If no data is returned (e.g., “Link not found”), check:
  - The site’s HTML structure (selectors might have changed)
  - The relevant scraper in `src/scrapers/*.scraper.ts`

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m "Add feature"`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request 🚀
