import * as axios from 'axios';

const API_GATEWAY_URL = 'http://localhost:5000'

export const refreshAsync = async (refreshToken) => {
    const response = await axios.get(`${API_GATEWAY_URL}/auth/refresh`, {
        headers: {
            refresh_token: refreshToken
        }
    });

    return response.data;
} 