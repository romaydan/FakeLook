const multer = require('multer');
const fs = require('fs');
const { promisify } = require('util');

const makedirAsync = promisify(fs.mkdir);
const opendirAsync = promisify(fs.opendir);

const storage = multer.diskStorage({
    //finds the user's directory. If not directory exists than is is created.
    destination: (req, file, cb) => {
        const { userId, postId } = req.body;
        const path = `./public/${userId}`;

        //trys to open the directory.
        opendirAsync(path)
            .then((dir) => {
                cb(null, dir.path);
                dir.close();
            })
            .catch(err => {
                //if the directory doesn't exist then it is created.
                makedirAsync(path)
                    .then(() => {
                        cb(null, path);
                    })
            })

    },

    //generates a filename for the image.
    filename: (req, file, cb) => {
        const { userId, postId } = req.body;
        const rgxResult = /\.[^.]+$/g.exec(file.originalname);
        const fileExtention = rgxResult[0];
        const filename = `${postId}${fileExtention}`;
        cb(null, filename);
    }
})

//filters all files except jpeg and png files.
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
        cb(null, true);
    else
        cb(null, false);
}

module.exports = multer({ storage: storage, fileFilter: fileFilter });