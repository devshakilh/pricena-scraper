"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var scraper_route_1 = require("./scraper.route");
var router = express_1.default.Router();
var moduleRoutes = [
    {
        path: '/scrape',
        route: scraper_route_1.default,
    },
];
moduleRoutes.forEach(function (route) { return router.use(route.path, route.route); });
exports.default = router;
