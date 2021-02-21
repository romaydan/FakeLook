const axios = require('axios');

const validateJwt = (req, res, next) => {
    const { authorization } = req.headers;

    if (authorization) {
        axios.get('http://localhost:5000/auth/validate', {
            headers: {
                authorization: authorization
            }
        })
            .then(response => {
                const { userId } = response.data;
                req.userId = userId
                next();
            })
            .catch(({ response: { data } }) => {
                res.status(data.statusCode ?? 500).json(data ?? { statusCode: 500, error: 'Unexpected failure!' });
            })
    } else {
        res.status(400).json({ statusCode: 400, error: 'No token provided under authirization header!' });

    }
}

module.exports = validateJwt;