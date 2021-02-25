import axios from 'axios';
import FormData from 'form-data';
import { injectable } from 'inversify';

export interface IImageUploader {
    uploadImage(userId: string, postId: string, uploadFile: any, accessToken: string): Promise<string>;
    deleteImage(imageUrl: string, accessToken: string): Promise<boolean>;
}

@injectable()
export class ImageUploader implements IImageUploader {
    private baseUrl: string = `http://localhost:${process.env.IMAGE_SERVER_PORT}/`;

    constructor() {

    }
    async deleteImage(imageUrl: string, accessToken: string): Promise<boolean> {
        const response = await axios.delete(this.baseUrl + 'image/delete', { 
            headers: {
                authorization: accessToken
            },
            data: { url: imageUrl } 
        });

        return response.status < 300;
    }

    async uploadImage(userId: string, postId: string, uploadFile: any, accessToken: string): Promise<string> {
        
        const form = new FormData();
        form.append('userId', userId);
        form.append('postId', postId);
        form.append('photo', uploadFile.buffer, {
            filename: uploadFile.fileName,
            contentType: uploadFile.mimetype,
            knownLength: uploadFile.size
        });
    
        const { data: { url } } = await axios.post(this.baseUrl + 'image/upload', form, {
            headers: {
                authorization: accessToken,
                'Content-Type': `multipart/form-data;boundary=${form.getBoundary()}`
            }
        });

        return url;
    }

    
}