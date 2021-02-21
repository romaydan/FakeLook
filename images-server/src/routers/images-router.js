const express = require('express');
const multer = require('multer');
const { promisify } = require('util');
const fs = require('fs');
const service = require('../services/upload-service');
const config = require('../config');

const delteFile = promisify(fs.unlink);
const upload = service;
const router = express.Router();

router.post('/upload', upload.single('photo'), (req, res, next) => {
    const path = req.file.path.replace('public', 'images').split('\\').join('/');
    const url = `http://localhost:${config.PORT}/${path}`

    res.json({ url: url });
})

router.delete('/delete', async (req, res, next) => {
    const { url } = req.body;
   
    let path = url.replace(`http://localhost:${config.PORT}/images`, 'public').split('/');
    const [_, userId] = path;
    path = path.join('/');

    if (userId !== req.userId)
        res.status(400).json({ statusCode: 400, error: 'userId and access token don\'t match!' });

    delteFile(path)
        .then(() => {
            res.status(200).json({ statusCode: 200, message: 'image deleted!' });
        })
        .catch(err => {
            res.status(400).send({ statusCode: 400, error: 'image don\'t exists!' });
        });
});

module.exports = router;