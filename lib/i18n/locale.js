"use strict";
exports.__esModule = true;
exports.getSupportedLocale = exports.isSupportedLocale = exports.defaultLocale = exports.SupportedLocale = void 0;
// Value must be in lowercase separated by hyphen
var SupportedLocale;
(function (SupportedLocale) {
    SupportedLocale["vi"] = "vi";
    SupportedLocale["viVN"] = "vi-vn";
    SupportedLocale["en"] = "en";
    SupportedLocale["enUS"] = "en-us";
})(SupportedLocale = exports.SupportedLocale || (exports.SupportedLocale = {}));
exports.defaultLocale = SupportedLocale.enUS;
function isSupportedLocale(language) {
    if (Object.values(SupportedLocale).includes(language)) {
        return true;
    }
    return false;
}
exports.isSupportedLocale = isSupportedLocale;
/**
 * Makes sure that the casing and format of the language is found in SupportedLocale. e.g.
 * vi_VN -> vi-vn
 * en-US -> en-us
 * en-us -> en-us
 */
function normalizeLanguage(language) {
    return language.toLowerCase().replace('_', '-');
}
function getSupportedLocale(languages) {
    if (Array.isArray(languages)) {
        for (var _i = 0, languages_1 = languages; _i < languages_1.length; _i++) {
            var language = languages_1[_i];
            var normalizedLanguage = normalizeLanguage(language);
            if (isSupportedLocale(normalizedLanguage)) {
                return normalizedLanguage;
            }
        }
    }
    else {
        var normalizedLanguage = normalizeLanguage(languages);
        if (isSupportedLocale(normalizedLanguage)) {
            return normalizedLanguage;
        }
    }
    return exports.defaultLocale;
}
exports.getSupportedLocale = getSupportedLocale;
