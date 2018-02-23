'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.normalizeHouse = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _normalizr = require('normalizr');

const zone = new _normalizr.schema.Entity('zones');

const thermostat = new _normalizr.schema.Entity('thermostats', {
    zones: [zone]
});

const house = new _normalizr.schema.Entity('houses', {
    thermostats: [thermostat]
}, {
    processStrategy(value, parent, key) {
        return _extends({}, value, {
            thermostats: value._links.child.find((_ref) => {
                let href = _ref.href;
                return href.includes('devices');
            }).data.items.filter(device => device.type.includes('thermostat'))
        });
    }
});

const normalizeHouse = exports.normalizeHouse = housePayload => (0, _normalizr.normalize)(housePayload, house);