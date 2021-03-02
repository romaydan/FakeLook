const express = require('express');
const multer = require('multer');
const { promisify } = require('util');
const fs = require('fs');
const service = require('../services/upload-service');
const config = require('../config');

const delteFileAsync = promisify(fs.unlink);
const upload = service;
const router = express.Router();

router.post('/upload', upload.single('photo'), (req, res, next) => {
    //removes the unnecessary directories from the image path.
    const path = req.file.path.replace('public', 'images').split('\\').join('/');
    //generates the image url with the path.
    const url = `http://localhost:${process.env.PORT}/${path}`

    res.json({ url });
})

router.delete('/delete', async (req, res, next) => {
    const { url } = req.body;
   
    //remoes the url and returns the image path as any array.
    let path = url.replace(`http://localhost:${process.env.PORT}/images`, 'public').split('/');
    const [_, userId] = path;
    path = path.join('/');

    if (userId !== req.userId)
        res.status(400).json({ statusCode: 400, error: 'userId and access token don\'t match!' });

    //deletes the image.
    delteFileAsync(path)
        .then(() => {
            res.status(200).json({ statusCode: 200, message: 'image deleted!' });
        })
        .catch(err => {
            res.status(400).send({ statusCode: 400, error: 'image doesn\'t exist!' });
        });
});

module.exports = router;