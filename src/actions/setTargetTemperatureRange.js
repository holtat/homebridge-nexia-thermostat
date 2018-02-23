import axios from 'axios';
import debounce from '../utils/debounce';

export const SET_TARGET_TEMPERATURE_RANGE_SUCCESS = 'SET_TARGET_TEMPERATURE_RANGE_SUCCESS';
export const setTargetTemperatureRange = data => (dispatch, getState) => {
    const {
        entities: { zones },
        config,
    } = getState();

    const zone = zones[config.zoneId];
    const thermostatFeature = zone.features.find(({ name }) => name === 'thermostat');
    const key = Object.keys(thermostatFeature.actions)[0];
    const url = thermostatFeature.actions[key].href;

    return new Promise(resolve => {
        setTargetTemperatureRangeDebounce(url, data, config, dispatch, resolve);
    });
}

const setTargetTemperatureRangeDebounce = debounce((url, data, { xMobileId, xApiKey }, dispatch, callback) =>
    axios({
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
    }), 1000);