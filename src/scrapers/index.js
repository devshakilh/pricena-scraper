"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapers = void 0;
var daraz_scraper_1 = require("./daraz.scraper");
var chaldal_scraper_1 = require("./chaldal.scraper");
var ajkerdeal_scraper_1 = require("./ajkerdeal.scraper");
var pickaboo_scraper_1 = require("./pickaboo.scraper");
var othoba_scraper_1 = require("./othoba.scraper");
var bagdoom_scraper_1 = require("./bagdoom.scraper");
var priyoshop_scraper_1 = require("./priyoshop.scraper");
var shodagor_scraper_1 = require("./shodagor.scraper");
var rokomari_scraper_1 = require("./rokomari.scraper");
var wafilife_scraper_1 = require("./wafilife.scraper");
var scraper_config_1 = require("../config/scraper.config");
exports.scrapers = {
    daraz: new daraz_scraper_1.DarazScraper(scraper_config_1.scraperSources.find(function (s) { return s.key === 'daraz'; }).baseUrl),
    chaldal: new chaldal_scraper_1.ChaldalScraper(scraper_config_1.scraperSources.find(function (s) { return s.key === 'chaldal'; }).baseUrl),
    ajkerdeal: new ajkerdeal_scraper_1.AjkerDealScraper(scraper_config_1.scraperSources.find(function (s) { return s.key === 'ajkerdeal'; }).baseUrl),
    pickaboo: new pickaboo_scraper_1.PickabooScraper(scraper_config_1.scraperSources.find(function (s) { return s.key === 'pickaboo'; }).baseUrl),
    othoba: new othoba_scraper_1.OthobaScraper(scraper_config_1.scraperSources.find(function (s) { return s.key === 'othoba'; }).baseUrl),
    bagdoom: new bagdoom_scraper_1.BagdoomScraper(scraper_config_1.scraperSources.find(function (s) { return s.key === 'bagdoom'; }).baseUrl),
    priyoshop: new priyoshop_scraper_1.PriyoShopScraper(scraper_config_1.scraperSources.find(function (s) { return s.key === 'priyoshop'; }).baseUrl),
    shodagor: new shodagor_scraper_1.ShodagorScraper(scraper_config_1.scraperSources.find(function (s) { return s.key === 'shodagor'; }).baseUrl),
    rokomari: new rokomari_scraper_1.RokomariScraper(scraper_config_1.scraperSources.find(function (s) { return s.key === 'rokomari'; }).baseUrl),
    wafilife: new wafilife_scraper_1.WafilifeScraper(scraper_config_1.scraperSources.find(function (s) { return s.key === 'wafilife'; }).baseUrl),
};
