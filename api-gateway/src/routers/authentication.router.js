const { Router } = require('express');
const axios = require('axios');
const cookie = require('cookie');

const router = Router();

const authServiceBaseUrl = process.env.AUTH_SERVICE_API_URL + '/auth';
const identityServiceBaseUrl = process.env.IDENITY_SERVICE_API_URL + '/api';

router.post('/fakelook/signup', async (req, res) => {
    try {
        const { email, password, confirmPassword, user, address } = req.body;

        const { data: { userId } } = await authPostRequest(req.path, { email, password, confirmPassword });
        const identityResponse = await identityPostRequest('/users', { user: { authId: userId, ...user }, address });

        res.json(identityResponse.data);
    } catch (error) {
        sendAxoisError(res, error);
    }
});

router.post('/fakelook/signin', async (req, res) => {
    try {
        const { password, email } = req.body;

        const authReponse = await authPostRequest(req.path, { password, email });

        const { accessToken, refreshToken } = authReponse.data;

        const identityRes = await identityGetRequest('/users', { authorization: accessToken }
        );

        res.json({ accessToken: accessToken, user: identityRes.data, refreshToken });
    } catch (error) {
        sendAxoisError(res, error);
    }
});

router.post('/facebook/signup', async (req, res) => {
    try {
        const { user, address, facebook_id, facebook_token } = req.body;

        const { data: { userId } } = await authPostRequest(req.path, { facebook_id, facebook_token });

        const { data } = await identityPostRequest('/users', { user: { authId: userId, ...user }, address });

        res.json(data);
    } catch (error) {
        sendAxoisError(res, error);
    }
})

router.get('/facebook/signin', async (req, res) => {
    try {
        const { facebook_id, facebook_token } = req.headers;

        const authResponse = await authGetRequest(req.path, { facebook_id, facebook_token });

        const { accessToken, refreshToken } = authResponse.data;

        const { data } = await identityGetRequest('/users', { authorization: accessToken });

        res.json({ accessToken: accessToken, user: data, refreshToken });

    } catch (error) {
        sendAxoisError(res, error);
    }
})

router.post('/google/signup', async (req, res) => {
    try {
        const { token_id, user, address } = req.body;

        const { data: { userId } } = await authPostRequest(req.path, { token_id });

        const { data } = await identityPostRequest('/users', { user: { authId: userId, ...user }, address });

        res.json(data);
    } catch (error) {
        sendAxoisError(res, error);
    }
})

router.get('/google/signin', async (req, res) => {
    try {
        const { token_id } = req.headers;

        const authResponse = await authGetRequest(req.path, { token_id });

        const { accessToken, refreshToken } = authResponse.data;

        const { data } = await identityGetRequest('/users', { authorization: accessToken });

        res.status(200).json({ accessToken: accessToken, user: data, refreshToken });

    } catch (error) {
        sendAxoisError(res, error);
    }
})

router.get('/logout', async (req, res) => {
    try {
        const { refresh_token } = req.headers;

        const response = await authGetRequest('/logout', { refresh_token });

        res.json(response.data);

    } catch (error) {
        sendAxoisError(res, error);
    }
})

router.get('/refresh', async (req, res) => {
    try {
        const { refresh_token } = req.headers;

        const { data } = await authGetRequest('/refresh', { refresh_token });

        res.json(data);
    } catch (error) {
        sendAxoisError(res, error);
    }
})

router.get('/jwt/signin', async (req, res) => {
    try {
        const { refresh_token } = req.headers;

        const { data: { accessToken } } = await authGetRequest('/refresh', { refresh_token });

        const { data: user } = await identityGetRequest('/users', { authorization: accessToken });

        res.json({ accessToken, user });

    } catch (error) {
        sendAxoisError(res, error);
    }
})

const authPostRequest = (path, body) => {
    return axios.post(`${authServiceBaseUrl}${path}`, body);
}

const authGetRequest = (path, headers) => {
    return axios.get(`${authServiceBaseUrl}${path}`, {
        headers: headers
    });
}

const identityPostRequest = (path, body) => {
    return axios.post(`${identityServiceBaseUrl}${path}`, body);
}

const identityGetRequest = (path, headers) => {
    return axios.get(`${identityServiceBaseUrl}${path}`, {
        headers: headers
    });
}

const sendAxoisError = (res, error) => {
    res.status(error.response.status).json(error.response.data);
}

module.exports = router;
