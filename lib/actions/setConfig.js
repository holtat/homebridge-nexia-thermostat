'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
const SET_CONFIG = exports.SET_CONFIG = 'SET_CONFIG';
const setConfig = exports.setConfig = payload => ({
    type: SET_CONFIG,
    payload
});