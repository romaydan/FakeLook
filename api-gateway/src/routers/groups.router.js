const { Router } = require('express');
const axios = require('axios');

const SOCIAL_SERVICE_URL = 'http://localhost:5006/api';
const router = Router();

router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { authorization } = req.headers;

        const response = await axios.get(`${SOCIAL_SERVICE_URL}/groups/${userId}`, {
            headers: { authorization }
        });

        res.json(response.data);

    } catch (error) {
        res.status(error.response.status).json(error.response.data);
    }
})

module.exports = router;