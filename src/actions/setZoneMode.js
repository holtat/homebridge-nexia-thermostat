import axios from 'axios';

export const SET_ZONE_MODE_SUCCESS = 'SET_ZONE_MODE_SUCCESS';
export const setZoneMode = value => (dispatch, getState) => {
    const {
        config: {
            apiroute,
            xMobileId,
            xApiKey,
            zoneId
        },
        entities: {
            zones
        }
    } = getState();
    
    const zone = zones[zoneId];
    const url = zone.settings.find(setting => setting.type === 'zone_mode')._links.self.href;

    return axios({
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