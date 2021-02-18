const express = require('express');
const multer = require('multer');
const multerOptions = require('../services/multer-configuration');


const upload = multer(multerOptions);
const router = express.Router();


router.post('/upload', upload.single('photo'), (req, res, next) => {
    res.json({ path: req.file.path });
})

module.exports = router;