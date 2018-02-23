"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = (fn, wait) => {
    var timeout;
    return function () {
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn(...args);
        }, wait || 500);
    };
};