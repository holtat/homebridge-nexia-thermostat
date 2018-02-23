'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setTargetTemperatureRange = exports.SET_TARGET_TEMPERATURE_RANGE_SUCCESS = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _debounce = require('../utils/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SET_TARGET_TEMPERATURE_RANGE_SUCCESS = exports.SET_TARGET_TEMPERATURE_RANGE_SUCCESS = 'SET_TARGET_TEMPERATURE_RANGE_SUCCESS';
const setTargetTemperatureRange = exports.setTargetTemperatureRange = data => (dispatch, getState) => {
    var _getState = getState();

    const zones = _getState.entities.zones,
          config = _getState.config;


    const zone = zones[config.zoneId];
    const thermostatFeature = zone.features.find((_ref) => {
        let name = _ref.name;
        return name === 'thermostat';
    });
    const key = Object.keys(thermostatFeature.actions)[0];
    const url = thermostatFeature.actions[key].href;

    return new Promise(resolve => {
        setTargetTemperatureRangeDebounce(url, data, config, dispatch, resolve);
    });
};

const setTargetTemperatureRangeDebounce = (0, _debounce2.default)((url, data, _ref2, dispatch, callback) => {
    let xMobileId = _ref2.xMobileId,
        xApiKey = _ref2.xApiKey;
    return (0, _axios2.default)({
        method: 'POST',
        url,
        data,
        headers: {
            'x-MobileId': xMobileId,
            'x-ApiKey': xApiKey
        }
    }).then(response => {
        dispatch({
            type: SET_TARGET_TEMPERATURE_RANGE_SUCCESS,
            payload: response.data.result
        });
        callback();
    });
}, 1000);