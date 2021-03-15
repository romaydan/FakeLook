import * as axios from 'axios';

const API_GATEWAY_URL = 'http://localhost:5000'

export const fakelookRegisterAsync = async (email, password, confirmPassword, user, address) => {
    // const { data: { statusCode, userId } } = await axios.post(`${BASE_AUTH_URL}/fakelook/signup`, { email, password, confirmPassword });
    const response = await axios.post(`${API_GATEWAY_URL}/auth/fakelook/signup`, { email, password, confirmPassword, user, address });
    return response.data;
}

export const facebookRegisterAsync = async (facebookToken, facebookId, user, address) => {
    const { data } = await axios.post(`${API_GATEWAY_URL}/auth/facebook/signup`, { user, address, facebook_id: facebookId, facebook_token: facebookToken })

    return data;
}

export const googleRegisterAsync = async (tokenId, user, address) => {
    const { data } = await axios.post(`${API_GATEWAY_URL}/auth/google/signup`, { user, address, token_id: tokenId })

    return data;
}