import { NextFunction, Request, Response } from "express";
import Busboy from 'busboy';

const formDataParser = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'POST' && req.headers['content-type'].includes('multipart/form-data;')) {
        req.body = {};
        const form = new Busboy({ headers: req.headers });

        form.on('field', (fieldName, val) => {
            req.body[fieldName] = val
        });

        form.on('file', (fieldName, file, fileName, encoding, mimetype) => {
            let buffers = [];
            file.on('data', (data) => {
                buffers.push(data);
            })

            file.on('end', () => {
                const buffer = Buffer.concat(buffers);
                req.body[fieldName] = {
                    fileName,
                    encoding,
                    mimetype,
                    buffer,
                    size: buffer.length
                }
            })
        });

        form.on('finish', () =>{
            next();
        });
        req.pipe(form);

    } else {
        res.status(400).json({ statusCode: 400, error: 'Method must be POST and Content-Type must be multipart/form-data!' });
    }
}

export default formDataParser;