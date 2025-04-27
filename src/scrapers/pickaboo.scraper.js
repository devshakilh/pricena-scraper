"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickabooScraper = void 0;
var utils_1 = require("../utils");
var logger_1 = require("../utils/logger");
var PickabooScraper = /** @class */ (function () {
    function PickabooScraper(baseUrl) {
        this.baseUrl = baseUrl;
    }
    PickabooScraper.prototype.scrape = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            var url, $_1, products_1, logo, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.baseUrl).concat(encodeURIComponent(product));
                        logger_1.default.info("Scraping Pickaboo for product: ".concat(product));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, utils_1.fetchHtml)(url)];
                    case 2:
                        $_1 = _a.sent();
                        products_1 = [];
                        logo = $_1('.logo img').attr('src') || 'logo not found';
                        $_1('.product-item').each(function (_, element) {
                            var name = $_1(element).find('.product-name').text().trim() || 'Name not found';
                            var price = $_1(element).find('.product-price').text().trim() || 'Out Of Stock';
                            var img = $_1(element).find('.product-image img').attr('src') || 'Image not found';
                            var link = $_1(element).find('.product-link').attr('href') || 'Link not found';
                            var id = (0, utils_1.genId)();
                            products_1.push({ id: id, name: name, price: price, img: img, link: link });
                        });
                        logger_1.default.info("Scraped ".concat(products_1.length, " products from Pickaboo"));
                        return [2 /*return*/, { name: 'Pickaboo', products: products_1, logo: logo }];
                    case 3:
                        error_1 = _a.sent();
                        logger_1.default.error("Failed to scrape Pickaboo for ".concat(product), { error: error_1 });
                        throw new Error("Error scraping Pickaboo for ".concat(product));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return PickabooScraper;
}());
exports.PickabooScraper = PickabooScraper;
