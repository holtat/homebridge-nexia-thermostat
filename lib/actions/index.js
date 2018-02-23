'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _setConfig = require('./setConfig');

Object.keys(_setConfig).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _setConfig[key];
    }
  });
});

var _getHouse = require('./getHouse');

Object.keys(_getHouse).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _getHouse[key];
    }
  });
});

var _setZoneMode = require('./setZoneMode');

Object.keys(_setZoneMode).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _setZoneMode[key];
    }
  });
});

var _setTargetTemperatureRange = require('./setTargetTemperatureRange');

Object.keys(_setTargetTemperatureRange).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _setTargetTemperatureRange[key];
    }
  });
});