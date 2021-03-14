import * as axios from 'axios';

// const BASE_AUTH_URL = 'http://localhost:5000/auth';s
// const BASE_IDENTITY_URL = 'http://localhost:5004/api/users';
const API_GATEWAY_URL = process.env.REACT_APP_API_GATEWAY_URL

export const fakelookLogin = async (email, password) => {
    const { status, data } = await axios.post(`${API_GATEWAY_URL}/auth/fakelook/signin`, { email, password });
    if (status < 300) {
        return data;
    }
}

export const facebookLogin = async (facebookToken, facebookId) => {
    const response = await axios.get(`${API_GATEWAY_URL}/auth/facebook/signin`, {
        headers: {
            facebook_id: facebookId, facebook_token: facebookToken,
        }
    })

    return response.data;
}



export const googleLogin = async (tokenId) => {
    const response = await axios.get(`${API_GATEWAY_URL}/auth/google/signin`, {
        headers: {
            token_id: tokenId
        }
    })

    return response.data;
}

export const loginWihJwt = async (refresh_token) => {
    const response = await axios.get(`${API_GATEWAY_URL}/auth/jwt/signin`, {
        headers: {
            refresh_token
        }
    })

    return response.data;
}