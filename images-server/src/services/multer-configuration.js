const multer = require("multer");
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const regex = /\.[^.]+$/g

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const opendir = promisify(fs.opendir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { userId, postId } = req.body;
        const path = `./public/${userId}`;

        opendir(path)
            .then((dir) => {

                cb(null, dir.path);
                dir.close();
            })
            .catch(err => {
                mkdir(path)
                    .then(() => {
                        cb(null, path);
                    })
            })

    },

    filename: (req, file, cb) => {
        const { userId, postId } = req.body;
        const fileExtention = regex.exec(file.originalname)[0];
        const filename = `${postId}${fileExtention}`;
        cb(null, filename);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
        cb(null, true);
    else
        cb(null, false);
}


module.exports = { storage: storage, fileFilter: fileFilter };