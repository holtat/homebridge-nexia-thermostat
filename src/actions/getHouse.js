import axios from 'axios';
import { normalizeHouse } from '../normalizr';

export const GET_HOUSE_SUCCESS = 'GET_HOUSE_SUCCESS';
export const getHouse = houseId => (dispatch, getState) => {
    const {
        config: {
            xMobileId,
            xApiKey,
            apiroute
        }
    } = getState();

    return axios({
        url: `/houses/${houseId}`,
        baseURL: apiroute,
        headers: {
            'x-MobileId': xMobileId,
            'x-ApiKey': xApiKey
        }
    }).then(response => {
        const payload = normalizeHouse(response.data.result);

        dispatch({ type: GET_HOUSE_SUCCESS, payload });
    });
};