"use strict";
exports.__esModule = true;
exports.getRandomInteger = exports.isNumeric = exports.between = void 0;
function between(num, min, max) {
    return Math.max(Math.min(num, max), min);
}
exports.between = between;
function isNumeric(value) {
    if (value === '') {
        return true;
    }
    if (isNaN(Number(value.replaceAll(' ', '')))) {
        return false;
    }
    return true;
}
exports.isNumeric = isNumeric;
function getRandomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.getRandomInteger = getRandomInteger;
