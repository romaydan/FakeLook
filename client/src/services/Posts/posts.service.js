import * as axois from 'axios';

const POSTS_BASE_URL = 'http://localhost:5010/posts'

export const getPosts = async (values) => {
    const accessToken = localStorage.getItem('access_token');

    const response = await axois.get(`${POSTS_BASE_URL}/get`, {
        headers: { authorization: accessToken },
        params: { ...values }
    })

    return response.data;
}

export const addNewPost = async post => {
    const accessToken = localStorage.getItem('access_token');
    const response = await axois.post(`${POSTS_BASE_URL}/add`, post, {
        headers: {
            authorization: accessToken
        }
    })

    return response.data;
}