const { Router } = require('express');
const axios = require('axios').default;

const groupsUrl = process.env.SOCIAL_SERVICE_API_URL + '/api/groups'
const usersUrl = process.env.IDENITY_SERVICE_API_URL + '/api/users'

const router = Router();

//GET /  return group
router.get('/', async (req, res) => {
    try {
        const { groupId, userId } = req.query;
        const { authorization } = req.headers;

        const { data: group } = await axios.get(groupsUrl, {
            headers: {
                authorization
            },
            params: {
                groupId, userId
            }
        });
        const friendsIds = group.friends.map(f => (f.friendId))
        const { data: groupFriends } = await axios.get(usersUrl + '/all', {

            headers: {
                authorization
            },
            params: {
                userIds: friendsIds
            }
        });
        group.friends = [...groupFriends]
        res.json(group);
    } catch (error) {
        returnError(res, error);

    }
})

router.get('/user', async (req, res) => {
    try {
        const { userId } = req.query;
        const { authorization } = req.headers;

        const { data: usersGroups } = await axios.get(groupsUrl + '/', {
            headers: {
                authorization
            },
            params: {
                userId
            }
        });
        res.json(usersGroups);
    } catch (error) {
        console.log('error.message', error.message)
        returnError(res, error);

    }

})

router.delete('/', async (req, res) => {
    try {

        const { userId, groupId } = req.query;
        const { authorization } = req.headers;

        const { data } = await axios.delete(groupsUrl, {
            headers: {
                authorization
            },
            params: {
                userId,
                groupId
            }
        })
        res.send(data);
    } catch (error) {
        returnError(res, error);

    }
})
router.post('/', async (req, res) => {
    try {
        const { userId, name } = req.body.data;
        const { authorization } = req.headers;

        const { data } = await axios.post(groupsUrl, {
            headers: {
                authorization
            },
            data: {
                userId, name
            }
        })
        res.send(data);
    } catch (error) {
        returnError(res, error);

    }

})
router.put('/name', async (req, res) => {
    try {
        const { userId, groupId, name } = req.query;
        const { authorization } = req.headers;

        const { data } = await axios.put(groupsUrl + '/name', {
            headers: {
                authorization
            },
            params: {
                userId,
                name,
                groupId
            }
        })
        res.send(data);
    } catch (error) {
        returnError(res, error);

    }

})
router.put('/add', async (req, res) => {
    try {
        const { userId, groupId, friendId } = req.body.data;
        const { authorization } = req.headers;

        const { data } = await axios.put(groupsUrl + '/addFriend', {
            headers: {
                authorization
            },
            data: {
                userId,
                friendId,
                groupId
            }
        })
        res.send(data);
    } catch (error) {
        returnError(res, error);
    }

})
router.put('/remove', async (req, res) => {
    try {
        const { userId, groupId, friendId } = req.body.data;
        const { authorization } = req.headers;

        const { data } = await axios.put(groupsUrl + '/removeFriend', {
            headers: {
                authorization
            },
            data: {
                userId,
                friendId,
                groupId
            }
        })
        res.send(data);
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
