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

export const fakelookRegister = async (email, password, confirmPassword, user, address) => {
    console.log(`${API_GATEWAY_URL}/auth/fakelook/signup`);
    // const { data: { statusCode, userId } } = await axios.post(`${BASE_AUTH_URL}/fakelook/signup`, { email, password, confirmPassword });
    const response = await axios.post(`${API_GATEWAY_URL}/auth/fakelook/signup`, { email, password, confirmPassword, user, address });
    return response.data;
}

export const facebookLogin = async (facebookToken, facebookId) => {
    const response = await axios.get(`${API_GATEWAY_URL}/auth/facebook/signin`, {
        headers: {
            facebook_id: facebookId, facebook_token: facebookToken
        }
    })

    return response.data;
}

export const facebookRegister = async (facebookToken, facebookId, user, address) => {
    const { data } = await axios.post(`${API_GATEWAY_URL}/auth/facebook/signup`, { user, address, facebook_id: facebookId, facebook_token: facebookToken })

    return data;
}

export const googleLogin = (tokenId) => {
    return axios.get(`${API_GATEWAY_URL}/auth/google/signin`, {
        headers: {
            token_id: tokenId
        }
    })
}

export const googleRegister = async (tokenId, user, address) => {
    const { data } = await axios.post(`${API_GATEWAY_URL}/auth/google/signup`, { user, address, token_id: tokenId })

    return data;
}