'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _house = require('./house');

Object.keys(_house).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _house[key];
    }
  });
});