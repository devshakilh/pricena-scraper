"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var express_rate_limit_1 = require("express-rate-limit");
var routes_1 = require("./routes");
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
var limiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 10,
    handler: function (req, res) {
        res.status(429).json({
            success: false,
            message: 'Too many requests. Please wait a minute and try again.',
        });
    },
});
app.use(limiter);
app.use(express_1.default.json());
app.use(routes_1.default);
app.get('/', function (req, res) {
    res.send("Welcome to the Pricena's Scraper API!");
});
exports.default = app;
