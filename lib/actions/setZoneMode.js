'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setZoneMode = exports.SET_ZONE_MODE_SUCCESS = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SET_ZONE_MODE_SUCCESS = exports.SET_ZONE_MODE_SUCCESS = 'SET_ZONE_MODE_SUCCESS';
const setZoneMode = exports.setZoneMode = value => (dispatch, getState) => {
    var _getState = getState(),
        _getState$config = _getState.config;

    const apiroute = _getState$config.apiroute,
          xMobileId = _getState$config.xMobileId,
          xApiKey = _getState$config.xApiKey,
          zoneId = _getState$config.zoneId,
          zones = _getState.entities.zones;


    const zone = zones[zoneId];
    const url = zone.settings.find(setting => setting.type === 'zone_mode')._links.self.href;

    return (0, _axios2.default)({
        method: 'POST',
        url,
        headers: {
            'x-MobileId': xMobileId,
            'x-ApiKey': xApiKey
        },
        data: { value }
    }).then(response => {
        dispatch({
            type: SET_ZONE_MODE_SUCCESS,
            payload: response.data.result
        });
    });
};