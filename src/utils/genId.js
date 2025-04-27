"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genId = genId;
var crypto_1 = require("crypto");
function genId() {
    return (0, crypto_1.randomUUID)();
}
