const { Router } = require('express');
const axios = require('axios');

const usersUrl = process.env.IDENITY_SERVICE_API_URL + '/api/users'
const friendsUrl = process.env.SOCIAL_SERVICE_API_URL + '/api/friends'
const router = Router();


router.get('/all', async (req, res) => {

    try {
        const { userId } = req.query;
        const { authorization } = req.headers;
        const { data: blocks } = await axios.get(friendsUrl + '/blocks', {
            headers: {
                authorization
            },
            params: {
                userIds: friendsList
            }
        });
        const { data: blockers } = await axios.get(friendsUrl + '/blockers', {
            headers: {
                authorization
            },
            params: {
                userId
            }
        });

        const { data: friendsList } = await axios.get(friendsUrl, {
            headers: {
                authorization
            },
            params: {
                userId
            }
        });
        if (friendsList.length > 0) {
            const { data: friends } = await axios.get(usersUrl + '/all', {
                headers: {
                    authorization
                },
                params: {
                    userIds: friendsList
                }
            });

            friendsWithBlocksAndBlockers = friends.map(f => {
                let user = { ...f };
                if (blocks.length > 0 && blocks.includes(f.id)) {
                    user = { ...f, block: true }
                }
                if (blockers.includes(f.id)) {
                    user = { ...f, blocked: true }
                }
                return user;
            })
            res.json(friendsWithBlocksAndBlockers);
        }
        else
            res.json([])

    } catch (error) {
        returnError(res, error);

    }
})

router.get('/name', async (req, res) => {

    try {
        const { name, userId } = req.query;
        const { authorization } = req.headers;
        const { data: users } = await axios.get(usersUrl + '/name', {
            headers: {
                authorization
            },
            params: {
                userId,
                name
            }
        });
        const { data: friendsList } = await axios.get(friendsUrl, {
            headers: {
                authorization
            },
            params: {
                userId
            }
        });


        const { data: reqsSent } = await axios.get(friendsUrl + '/request/sent', {
            headers: { authorization },
            params: { userId }
        });

        console.log('friendsList', friendsList)
        let noFriendUsers = users.filter(u => !friendsList.includes(u.authId))
        noFriendUsers = noFriendUsers.map(u => reqsSent.includes(u.authId) ? { ...u, sent: true } : { ...u })
        res.json(noFriendUsers);
    } catch (error) {
        console.log('error', error.message)
        returnError(res, error);
    }
})
router.delete('/', async (req, res) => {
    try {
        const { userId, friendId } = req.query;
        const { authorization } = req.headers;

        const { data } = await axios.delete(friendsUrl, {
            headers: {
                authorization
            },
            params: {
                userId,
                friendId
            }
        });

        res.send(data);
    } catch (error) {
        returnError(res, error);
    }
})

router.patch('/block/', async (req, res) => {
    try {

        const { userId, friendId } = req.body.data;
        let { authorization } = req.headers;
        authorization = 'null';
        const { data } = await axios.patch(friendsUrl + '/block', {
            headers: {
                authorization
            },
            data: {
                userId,
                friendId
            }
        });

        res.json(data);
    } catch (error) {
        returnError(res, error);
    }
})

router.patch('/unblock/', async (req, res) => {
    try {

        const { userId, friendId } = req.body.data;
        let { authorization } = req.headers;
        authorization = 'null'
        const { data } = await axios.patch(friendsUrl + '/unblock', {
            headers: {
                authorization
            },
            data: {
                userId,
                friendId
            }
        });
        res.json(data);
    } catch (error) {
        returnError(res, error);
    }
})


router.get('/request', async (req, res) => {
    try {
        const { userId } = req.query;
        let { authorization } = req.headers;
        authorization = 'null'
        const { data: reqList } = await axios.get(friendsUrl + '/request', {
            headers: { authorization },
            params: { userId }
        });

        const { data: users } = await axios.get(usersUrl + '/all', {
            headers: {
                authorization
            },
            params: {
                userIds: [...reqList]
            }
        });

        res.json(users);
    } catch (error) {
        returnError(res, error);
    }
})
router.post('/request', async (req, res) => {
    try {
        const { userId, recepientId } = req.body.data;
        const { authorization } = req.headers;

        const { data: result } = await axios.post(friendsUrl + '/request', { headers: authorization, data: { userId, recepientId } });

        res.json(result);
    } catch (error) {
        returnError(res, error);

    }
})

router.patch('/request/accept', async (req, res) => {
    try {
        const { userId, senderId } = req.body.data;
        const { authorization } = req.headers;

        const { data } = await axios.patch(friendsUrl + '/request/accept', {
            headers: {
                authorization
            },
            data: {
                userId, senderId
            }
        });

        res.json(data);
    } catch (error) {
        returnError(res, error);
    }
})

router.patch('/request/decline', async (req, res) => {
    try {
        const { userId, senderId } = req.body.data;
        const { authorization } = req.headers;

        const { data } = await axios.patch(friendsUrl + '/request/decline', {
            headers: {
                authorization
            },
            data: {
                userId, senderId
            }
        });

        res.json(data);
    } catch (error) {
        returnError(res, error);
    }

})

const returnError = (res, error) => {
    try {
        res.status(error.response.status).json(error.response)
    } catch (error) {
        res.status(500).json(error)

    }

}
module.exports = router;