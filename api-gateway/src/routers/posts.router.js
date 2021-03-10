const { Router } = require('express');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const formidable = require('express-formidable');

const router = Router();

const POSTS_SERVICE_URL = 'http://localhost:5005';
const IDENTITY_SERVICE_URL = 'http://localhost:5004/api/users';

const formidableMiddleWare = formidable({
    type: 'multipart',
    keepExtensions: true,
    multiples: true
})

router.post('/add', formidableMiddleWare, (req, res) => {
    try {
        const { authorization: accessToken } = req.headers;
        const { coordinates, showTo, tags, textContent, userTags } = req.fields;
        const { photo } = req.files;

        const stream = fs.createReadStream(`${photo.path}`);
        const chuncks = [];
        stream.on('data', (chunck) => {
            chuncks.push(chunck);
        });

        stream.once('end', async () => {
            const buffer = Buffer.concat(chuncks);

            const form = new FormData();
            form.append('photo', buffer, { contentType: photo.type, filename: photo.name, knownLength: buffer.length })
            form.append('coordinates', coordinates);
            form.append('showTo', showTo);
            form.append('tags', tags);
            form.append('textContent', textContent);
            form.append('userTags', userTags);

            const response = await axios.post(`${POSTS_SERVICE_URL}/posts${req.path}`, form, {
                headers: {
                    authorization: accessToken,
                    'Content-Type': `multipart/form-data;boundary=${form.getBoundary()}`
                }
            })
            res.json(response.data);
        });

    } catch (error) {
        res.status(error.response.status).json(error.response);
    }
})

router.get('/', async (req, res) => {
    try {
        const { authorization } = req.headers;
        const { userTags, tags, publishers, distance, location, from: fromDate, to: toDate } = req.query;

        const { data: posts } = await axios.get(`${POSTS_SERVICE_URL}/posts`, {
            headers: {
                authorization,
            },
            params: { userTags, tags, publishers, distance, location, fromDate, toDate }
        })

        if (posts.length > 0) {
            const { data: users } = await axios.get(`${IDENTITY_SERVICE_URL}/all`, {
                headers: {
                    authorization
                },
                params: { userIds: publishers }
            });

            for (const post of posts) {
                const user = users.find(u => u.authId === post.publisherId);
                post.publisher = user.name;
            }

        }
        res.json(posts);

    } catch (error) {
        res.status(error.response.status).json(error.response.data)
    }

})

router.get('/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const { authorization } = req.headers;

        const { data: post } = await axios.get(`${POSTS_SERVICE_URL}/posts/${postId}`, {
            headers: {
                authorization
            }
        })

        const { data: users } = await axios.get(`${IDENTITY_SERVICE_URL}/all`, {
            headers: {
                authorization
            },
            params: { userIds: [post.publisherId] }
        })
        post.name = users[0].name

        res.json(post);
    } catch (error) {
        res.status(error.response.status).json(error.response.data);
    }
})

router.post('/comment', async (req, res) => {
    try {
        const { comment, postId } = req.body;
        const { authorization } = req.headers;

        const { data: newComment } = await axios.post(`${POSTS_SERVICE_URL}/comments/add`, { comment: comment, postId: postId }, {
            headers: { authorization }
        });

        res.json(newComment);

    } catch (error) {
        res.status(error.response.status).json(error.response.data)
    }
})

router.post('/like', async (req, res) => {
    try {
        const { postId, userId } = req.body;
        const { authorization } = req.headers;

        const { data: like } = await axios.post(`${POSTS_SERVICE_URL}/likes/add`, { postId, userId }, {
            headers: { authorization }
        });

        res.json(like);

    } catch (error) {
        res.status(error.response.status).json(error.response.data);
    }
});

router.delete('/like', async (req, res) => {
    try {
        const { postId, userId } = req.query;
        const { authorization } = req.headers;

        const { data, statusCode } = await axios.delete(`${POSTS_SERVICE_URL}/likes/remove`, {
            headers: { authorization },
            params: { postId, userId }
        });

        res.json(data);

    } catch (error) {
        res.status(error.response.status).json(error.response.data);
    }
});

router.post('/tag', async (req, res) => {
    try {
        const { postId, tag } = req.body;
        const { authorization } = req.headers;

        const postResponse = await axios.post(`${POSTS_SERVICE_URL}/tags/add`, { postId, tag }, {
            headers: { authorization }
        })

        res.json(postResponse.data);
    } catch (error) {
        res.status(error.response?.status ?? 500).json(error.response?.data);
    }
})

router.post('/usertag', async (req, res) => {
    try {
        const { postId, userId, name } = req.body;
        const { authorization } = req.headers;

        const postResponse = await axios.post(`${POSTS_SERVICE_URL}/usertags/add`, { postId, userId, name }, {
            headers: { authorization }
        })

        res.json(postResponse.data);

    } catch (error) {
        res.status(error.response?.status ?? 500).json(error.response?.data);
    }
})

module.exports = router;