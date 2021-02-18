const express = require('express');
const multer = require('multer');
const multerOptions = require('../services/multer-configuration');
const fs = require('fs');
const { promisify } = require('util');

const delteFile = promisify(fs.unlink);

const upload = multer(multerOptions);
const router = express.Router();

router.post('/upload', upload.single('photo'), (req, res, next) => {
    res.json({ path: req.file.path });
})

router.delete('/delete', async (req, res, next) => {
    const { filePath, accessToken } = req.body;

    const path = './public/' + filePath;

    try {
        await delteFile(path);
        res.status(200).json({ statusCode: 200, message: 'image deleted!' });
    } catch (error) {
        res.status(400).send({ statusCode: 400, message: 'file don\'t exists!' });
    }
});

module.exports = router;