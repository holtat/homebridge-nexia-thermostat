'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _actions = require('./actions');

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function config() {
    let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let action = arguments[1];

    switch (action.type) {
        case actions.SET_CONFIG:
            return action.payload;
        default:
            return state;
    }
}

function entities() {
    let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let action = arguments[1];

    switch (action.type) {
        case actions.GET_HOUSE_SUCCESS:
            return _extends({}, state, action.payload.entities);

        case actions.SET_ZONE_MODE_SUCCESS:
        case actions.SET_TARGET_TEMPERATURE_RANGE_SUCCESS:
            return _extends({}, state, {
                zones: _extends({}, state.zones, {
                    [action.payload.id]: action.payload
                })
            });

        default:
            return state;
    }
}

const store = (0, _redux.createStore)((0, _redux.combineReducers)({
    entities,
    config
}), (0, _redux.applyMiddleware)(_reduxThunk2.default));

exports.default = store;