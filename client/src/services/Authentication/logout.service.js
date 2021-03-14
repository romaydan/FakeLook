import * as axios from 'axios';

const API_GATEWAY_URL = 'http://localhost:5000'

export const logoutAsync = (refreshToken) => {
    return axios.get(`${API_GATEWAY_URL}/auth/logout`, {
        headers: {
            refresh_token: refreshToken
        }
    })
}