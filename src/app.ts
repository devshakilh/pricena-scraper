import express, { Application } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import router from './routes';

const app: Application = express();

app.use(cors());
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please wait a minute and try again.',
    });
  },
});

app.use(limiter);
app.use(express.json());
app.use(router);

app.get('/', (req, res) => {
  res.send("Welcome to the Pricena's Scraper API!");
});

export default app;