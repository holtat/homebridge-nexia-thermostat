import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import * as actions from './actions';

function config(state = {}, action) {
    switch (action.type) {
        case actions.SET_CONFIG:
            return action.payload;
        default:
            return state;
    }
}

function entities(state = {}, action) {
    switch (action.type) {
        case actions.GET_HOUSE_SUCCESS:
            return {
                ...state,
                ...action.payload.entities
            };

        case actions.SET_ZONE_MODE_SUCCESS:
        case actions.SET_TARGET_TEMPERATURE_RANGE_SUCCESS:
            return {
                ...state,
                zones: {
                    ...state.zones,
                    [action.payload.id]: action.payload
                }
            };

        default:
            return state;
    }
}

const store = createStore(
    combineReducers({
        entities,
        config
    }),
    applyMiddleware(thunk)
);

export default store;