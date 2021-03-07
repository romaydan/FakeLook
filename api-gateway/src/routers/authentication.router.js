const { Router } = require('express');
const axios = require('axios');
const cookie = require('cookie');

const router = Router();

const authServiceBaseUrl = 'http://localhost:5000/auth';
const identityServiceBaseUrl = 'http://localhost:5004/api';

router.post('/fakelook/signup', async (req, res) => {
    try {
        const { email, password, confirmPassword, user, address } = req.body;

        const { data: { userId } } = await authPostRequest(req.path, { email, password, confirmPassword });
        const identityResponse = identityPostRequest('/users', { user: { authId: userId, ...user }, address });

        res.json(identityResponse.data);
    } catch (error) {
        res.status(error.response.status).json(error.message);
    }
});

router.post('/fakelook/signin', async (req, res) => {
    try {
        const { password, email } = req.body;

        const authReponse = await authPostRequest(req.path, { password, email });

        const { accessToken } = authReponse.data;
        const { refresh_token } = cookie.parse(authReponse.headers['set-cookie'][0]);

        const identityRes = await identityGetRequest('/users', { authorization: accessToken }
        );

        res.cookie('refresh_token', refresh_token);
        res.json({ accessToken: accessToken, user: identityRes.data });
    } catch (error) {
        res.status(error.status).json(error.message);
    }
});

router.post('/facebook/signup', async (req, res) => {
    try {
        const { user, address, facebook_id, facebook_token } = req.body;

        const { data: { userId } } = await authPostRequest(req.path, { facebook_id, facebook_token });
        const { data } = await identityPostRequest('/users', { user: { authId: userId, ...user }, address });

        res.json(data);
    } catch (error) {
        res.status(error.response.status).json(error.response.message);
    }
})

router.get('/facebook/signin', async (req, res) => {
    try {
        const { facebook_id, facebook_token } = req.headers;

        const authResponse = await authGetRequest(req.path, { facebook_id, facebook_token });

        const { accessToken } = authResponse.data;
        const { refresh_token } = cookie.parse(authResponse.headers['set-cookie'][0]);

        const { data } = await identityGetRequest('/users', { authorization: accessToken });

        res.cookie('refresh_token', refresh_token);
        res.json({ accessToken: accessToken, user: data });

    } catch (error) {
        res.status(error.response.status).json(error.response.message);
    }
})

router.post('/google/signup', async (req, res) => {
    try {
        const { token_id, user, address } = req.body;

        const { data: { userId } } = await authPostRequest(req.path, { token_id });
        const { data } = await identityPostRequest('/users', { user: { authId: userId, ...user }, address });

        res.json(data);
    } catch (error) {
        res.status(error.response.status).json(error.response.message);
    }
})

router.get('/google/signin', async (req, res) => {
    try {
        const { token_id } = req.headers;

        const authResponse = await authGetRequest(req.path, { token_id });

        const { accessToken } = authResponse.data;
        const { refresh_token } = cookie.parse(authResponse.headers['set-cookie'][0]);

        const { data } = await identityGetRequest('/users', { authorization: accessToken });

        res.cookie('refresh_token', refresh_token);
        res.json({ accessToken: accessToken, user: data });

    } catch (error) {
        res.status(error.response.status).json(error.response.message);
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


module.exports = router;
