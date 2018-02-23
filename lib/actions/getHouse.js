'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getHouse = exports.GET_HOUSE_SUCCESS = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _normalizr = require('../normalizr');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const GET_HOUSE_SUCCESS = exports.GET_HOUSE_SUCCESS = 'GET_HOUSE_SUCCESS';
const getHouse = exports.getHouse = houseId => (dispatch, getState) => {
    var _getState = getState(),
        _getState$config = _getState.config;

    const xMobileId = _getState$config.xMobileId,
          xApiKey = _getState$config.xApiKey,
          apiroute = _getState$config.apiroute;


    return (0, _axios2.default)({
        url: `/houses/${houseId}`,
        baseURL: apiroute,
        headers: {
            'x-MobileId': xMobileId,
            'x-ApiKey': xApiKey
        }
    }).then(response => {
        const payload = (0, _normalizr.normalizeHouse)(response.data.result);

        dispatch({ type: GET_HOUSE_SUCCESS, payload });
    });
};