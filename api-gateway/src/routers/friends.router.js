const { Router } = require('express');
const axios = require('axios');

const SOCIAL_SERVICE_URL = 'http://localhost:5006';
const IDENTITY_SERVICE_URL = 'http://localhost:5004';
const router = Router();

router.get('/all', async (req, res) => {
    try {
        const { userId } = req.query;
        const { authorization } = req.headers;
    
        const { data: friendsList } = await axios.get(`${SOCIAL_SERVICE_URL}/api/friends/${userId}`);
        const { data: friends } = await axios.get(`${IDENTITY_SERVICE_URL}/api/users/all`, {
            headers: {
                authorization
            },
            params: {
                userIds: friendsList
            }
        });
    
        res.json(friends);
    } catch (error) {
        res.status(error.response.status).json(error.response)
    }
})

module.exports = router;