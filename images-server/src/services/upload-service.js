const multer = require('multer');
const fs = require('fs');
const { promisify } = require('util');

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
        const rgxResult = /\.[^.]+$/g.exec(file.originalname);
        const fileExtention = rgxResult[0];
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

module.exports = multer({ storage: storage, fileFilter: fileFilter });