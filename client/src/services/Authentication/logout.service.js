import * as axios from 'axios';

const API_GATEWAY_URL = process.env.REACT_APP_API_GATEWAY_URL

export const logoutAsync = (refreshToken) => {
    return axios.get(`${API_GATEWAY_URL}/auth/logout`, {
        headers: {
            refresh_token: refreshToken
        }
    })
}