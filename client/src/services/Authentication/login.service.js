import * as axios from 'axios';

const API_GATEWAY_URL = 'http://localhost:5000'

export const fakelookLoginAsync = async (email, password) => {
    const { status, data } = await axios.post(`${API_GATEWAY_URL}/auth/fakelook/signin`, { email, password });
    if (status < 300) {
        return data;
    }
}

export const facebookLoginAsync = async (facebookToken, facebookId) => {
    const response = await axios.get(`${API_GATEWAY_URL}/auth/facebook/signin`, {
        headers: {
            facebook_id: facebookId, facebook_token: facebookToken,
        }
    })

    return response.data;
}



export const googleLoginAsync = async (tokenId) => {
    const response = await axios.get(`${API_GATEWAY_URL}/auth/google/signin`, {
        headers: {
            token_id: tokenId
        }
    })

    return response.data;
}

export const loginWihJwtAsync = async (refreshToken) => {
    const response = await axios.get(`${API_GATEWAY_URL}/auth/jwt/signin`, {
        headers: {
            refresh_token: refreshToken
        }
    })

    return response.data;
}