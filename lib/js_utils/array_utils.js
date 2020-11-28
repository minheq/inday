"use strict";
exports.__esModule = true;
exports.areArraysEqual = exports.sample = exports.chunk = exports.isEmptyArray = exports.groupBy = exports.splitLast = exports.keyedBy = exports.hasNoneOf = exports.hasAllOf = exports.hasAnyOf = exports.differenceBy = exports.intersectBy = exports.intersect = exports.updateLast = exports.append = exports.remove = exports.take = exports.unique = exports.uniqueBy = exports.isNotEmpty = exports.secondLast = exports.last = exports.first = exports.range = void 0;
var number_utils_1 = require("./number_utils");
function range(arg0, arg1, arg2) {
    var arr = [];
    if (!arg1) {
        for (var i = 0; i < arg0; i++) {
            arr.push(i);
        }
        return arr;
    }
    for (var i = arg0; i <= arg1; i = i + (arg2 || 1)) {
        arr.push(i);
    }
    return arr;
}
exports.range = range;
/**
 * Get first item in the array.
 * IMPORTANT: Make sure to check that the array is not empty first.
 */
function first(arr) {
    return arr[0];
}
exports.first = first;
/**
 * Get last item in the array.
 * IMPORTANT: Make sure to check that the array is not empty first.
 */
function last(arr) {
    return arr[arr.length - 1];
}
exports.last = last;
function secondLast(arr) {
    return arr[arr.length - 2];
}
exports.secondLast = secondLast;
function isNotEmpty(arr) {
    return arr.length > 0;
}
exports.isNotEmpty = isNotEmpty;
function uniqueBy(arr, getValue) {
    var map = {};
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        var val = getValue(item);
        if (map[val]) {
            continue;
        }
        map[val] = true;
        result.push(item);
    }
    return result;
}
exports.uniqueBy = uniqueBy;
function unique(arr) {
    return Array.from(new Set(arr));
}
exports.unique = unique;
function take(arr, size) {
    return arr.slice(0, size);
}
exports.take = take;
function remove(arr, size) {
    return arr.slice(0, arr.length - size);
}
exports.remove = remove;
function append(arr, item) {
    return arr.concat(item);
}
exports.append = append;
function updateLast(arr, updater) {
    var nextArr = arr.slice(0);
    nextArr[arr.length - 1] = updater(arr[arr.length - 1]);
    return nextArr;
}
exports.updateLast = updateLast;
function intersect(a, b) {
    var setA = new Set(a);
    var setB = new Set(b);
    var intersection = new Set(Array.from(setA).filter(function (x) { return setB.has(x); }));
    return Array.from(intersection);
}
exports.intersect = intersect;
/** Returns array of values found in left and right array */
function intersectBy(a, b, getValue) {
    var bMap = {};
    for (var i = 0; i < b.length; i++) {
        var itemB = b[i];
        var val = getValue(itemB);
        bMap[val] = itemB;
    }
    var result = [];
    for (var i = 0; i < a.length; i++) {
        var itemA = a[i];
        var val = getValue(itemA);
        if (bMap[val] !== undefined) {
            result.push(itemA);
        }
    }
    return result;
}
exports.intersectBy = intersectBy;
/** Returns array of values in left array that are not in the right array */
function differenceBy(a, b, getValue) {
    var bMap = {};
    for (var i = 0; i < b.length; i++) {
        var itemB = b[i];
        var val = getValue(itemB);
        bMap[val] = itemB;
    }
    var result = [];
    for (var i = 0; i < a.length; i++) {
        var itemA = a[i];
        var val = getValue(itemA);
        if (bMap[val] === undefined) {
            result.push(itemA);
        }
    }
    return result;
}
exports.differenceBy = differenceBy;
function hasAnyOf(a, b) {
    return isNotEmpty(intersect(a, b));
}
exports.hasAnyOf = hasAnyOf;
function hasAllOf(a, b) {
    var intersection = intersect(a, b);
    return intersection.length === a.length && a.length === b.length;
}
exports.hasAllOf = hasAllOf;
function hasNoneOf(a, b) {
    return isEmptyArray(intersect(a, b));
}
exports.hasNoneOf = hasNoneOf;
/**
 * Returns an object with keys as chosen property of the item,
 * and value as item.
 */
function keyedBy(items, getKey) {
    var result = {};
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        var key = getKey(item);
        result[key] = item;
    }
    return result;
}
exports.keyedBy = keyedBy;
/**
 *
 * Example:
 * ```
 * splitLast([1, 2, 3])
 * // => [[1, 2], 3]
 * ```
 */
function splitLast(items) {
    return [items.slice(0, items.length - 1), items[items.length - 1]];
}
exports.splitLast = splitLast;
/**
 * Returns an object with keys as chosen property of the item,
 * and value as array of item with same key.
 */
function groupBy(items, getKey) {
    var grouped = {};
    for (var _i = 0, items_2 = items; _i < items_2.length; _i++) {
        var item = items_2[_i];
        var key = getKey(item);
        if (grouped[key]) {
            grouped[key].push(item);
        }
        else {
            grouped[key] = [item];
        }
    }
    return grouped;
}
exports.groupBy = groupBy;
function isEmptyArray(data) {
    return data.length === 0;
}
exports.isEmptyArray = isEmptyArray;
function chunk(arr, size) {
    var result = [];
    for (var i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, size + i));
    }
    return result;
}
exports.chunk = chunk;
function sample(arr) {
    var index = number_utils_1.getRandomInteger(0, arr.length - 1);
    return arr[index];
}
exports.sample = sample;
/**
 * Compares whether 2 arrays are equal
 * @param order If true, both array items must be in the same order
 */
function areArraysEqual(a, b, order) {
    if (order === void 0) { order = false; }
    if (order === true) {
        for (var i = 0; i < a.length; i++) {
            var itemA = a[i];
            var itemB = b[i];
            if (itemA !== itemB) {
                return false;
            }
        }
        return true;
    }
    return hasAllOf(a, b);
}
exports.areArraysEqual = areArraysEqual;
