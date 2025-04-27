"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var scraper_controller_1 = require("../controllers/scraper.controller");
var router = express_1.default.Router();
router.get('/:product', scraper_controller_1.ScraperController.getAllScrape);
exports.default = router;
