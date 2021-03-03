import * as axios from 'axios';

const BASE_AUTH_URL = 'http://localhost:5000/auth';
const BASE_IDENTITY_URL = 'http://localhost:5004/api/users'

export const fakelookLogin = async (email, password) => {
    const { data: { statusCode, accessToken } } = await axios.post(`${BASE_AUTH_URL}/fakelook/signin`, { email, password });
    if(statusCode < 300) {
        const { data: user } = await axios.get(`${BASE_IDENTITY_URL}`, {
            headers: {
                authorization: accessToken
            }
        });

        return user;
    }
}

export const fakelookRegister = async (email, password, confirmPassword, user, address) => {
    const { data: { statusCode, userId } } = await axios.post(`${BASE_AUTH_URL}/fakelook/signup`, { email, password, confirmPassword });
    if(statusCode < 300) {
        return await axios.post(BASE_IDENTITY_URL, { user: { authId: userId, ...user }, address });
    }
}

export const facebookLogin = (facebookToken, facebookId) => {
    return axios.get(`${BASE_AUTH_URL}/facebook/signin`, {
        headers: {
            facebook_token: facebookToken,
            facebook_id: facebookId
        }
    })
}

export const facebookRegister = async (facebookToken, facebookId, user, address) => {
    const { data: { statusCode, userId } } = await axios.get(`${BASE_AUTH_URL}/facebook/signup`, {
        headers: {
            facebook_token: facebookToken,
            facebook_id: facebookId
        }
    })

    if(statusCode < 300) {
        return await axios.post(BASE_IDENTITY_URL, { user: { authId: userId, ...user }, address });
    }
}

export const googleLogin = (tokenId) => {
    return axios.get(`${BASE_AUTH_URL}/google/signin`, {
        headers: {
            token_id: tokenId
        }
    })
}

export const googleRegister = async (tokenId, user, address) => {
    const { data: { statusCode, userId } } = await axios.get(`${BASE_AUTH_URL}/google/signup`, {
        headers: {
            token_id: tokenId
        }
    })

    if(statusCode < 300) {
        return await axios.post(BASE_IDENTITY_URL, { user: { authId: userId, ...user }, address });
    }
}