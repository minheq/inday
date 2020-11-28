"use strict";
exports.__esModule = true;
exports.formatUnit = void 0;
function formatUnit(amount, locale, unit) {
    return new Intl.NumberFormat(locale, {
        style: 'unit',
        unit: unit
    }).format(amount);
}
exports.formatUnit = formatUnit;
