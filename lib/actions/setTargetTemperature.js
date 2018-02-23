'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setTargetTemperature = exports.SET_TARGET_TEMPERATURE_SUCCESS = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SET_TARGET_TEMPERATURE_SUCCESS = exports.SET_TARGET_TEMPERATURE_SUCCESS = 'SET_TARGET_TEMPERATURE_SUCCESS';
const setTargetTemperature = exports.setTargetTemperature = value => (dispatch, getState) => {
    var _getState = getState();

    const zones = _getState.entities.zones;
    var _getState$config = _getState.config;
    const zoneId = _getState$config.zoneId,
          xMobileId = _getState$config.xMobileId,
          xApiKey = _getState$config.xApiKey;


    const zone = zones[zoneId];
    const thermostatFeature = zone.features.find((_ref) => {
        let name = _ref.name;
        return name === 'thermostat';
    });
    const key = Object.keys(thermostatFeature.actions)[0];
    const url = thermostatFeature.actions[key].href;

    return (0, _axios2.default)({
        method: 'POST',
        url,
        data: { heat: value },
        headers: {
            'x-MobileId': xMobileId,
            'x-ApiKey': xApiKey
        }
    }).then(response => {
        dispatch({
            type: SET_TARGET_TEMPERATURE_SUCCESS,
            payload: response.data.result
        });
    });
};