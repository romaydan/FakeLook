import { NextFunction, Request, Response } from "express";
import Busboy from 'busboy';

const formDataParser = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'POST' && req.headers['content-type'].includes('multipart/form-data;')) {
        req.body = {};
        const form = new Busboy({ headers: req.headers });

        //when a filed is parsed it is added to the request body.
        form.on('field', (fieldName, val) => {
            req.body[fieldName] = val
        });

        //when a file is parsed.
        form.on('file', (fieldName, file, fileName, encoding, mimetype) => {
            let buffers = [];
            //reads the data from the file stream and pushes it to the buffers array.
            file.on('data', (data) => {
                buffers.push(data);
            })

            file.on('end', () => {
                //all the buffers are combined to one buffer.
                const buffer = Buffer.concat(buffers);
                //adds the file to the request body.
                req.body[fieldName] = {
                    fileName,
                    encoding,
                    mimetype,
                    buffer,
                    size: buffer.length
                }
            })
        });

        form.on('finish', () => {
            next();
        });

        req.pipe(form);
        return;
    }
    res.status(400).json({ statusCode: 400, error: 'Method must be POST and Content-Type must be multipart/form-data!' });
}

export default formDataParser;