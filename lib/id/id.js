"use strict";
exports.__esModule = true;
exports.validateID = exports.generateID = void 0;
var nanoid_1 = require("nanoid");
var nanoid = nanoid_1.customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 15);
function generateID(prefix) {
    return "" + prefix + nanoid();
}
exports.generateID = generateID;
function validateID(prefix, id) {
    return;
}
exports.validateID = validateID;
