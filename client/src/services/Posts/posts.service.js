import * as axois from 'axios';

const POSTS_BASE_URL = 'http://localhost:5010'

export const getPosts = async (values) => {
    const accessToken = sessionStorage.getItem('access_token');

    const response = await axois.get(`${POSTS_BASE_URL}/posts`, {
        headers: { authorization: accessToken },
        params: { ...values }
    })

    return response.data;
}

export const getPostById = async (postId) => {
    const accessToken = sessionStorage.getItem('access_token');
    const response = await axois.get(`${POSTS_BASE_URL}/posts/${postId}`, {
        headers: { authorization: accessToken }
    });

    return response.data;
}

export const addNewPost = async post => {
    const accessToken = sessionStorage.getItem('access_token');
    const response = await axois.post(`${POSTS_BASE_URL}/posts/add`, post, {
        headers: {
            authorization: accessToken
        }
    })

    return response.data;
}

export const addComment = async (comment, postId) => {
    const accessToken = sessionStorage.getItem('access_token'); 
    const response = await axois.post(`${POSTS_BASE_URL}/posts/comment`, { comment, postId }, {
        headers: {
            authorization: accessToken
        }
    });

    return response.data;
}

export const addLike = async (postId, userId) => {
    const accessToken = sessionStorage.getItem('access_token'); 
    const response = await axois.post(`${POSTS_BASE_URL}/posts/like`, { userId, postId }, {
        headers: {
            authorization: accessToken
        }
    });

    return response.data;
}

export const removeLike = async (postId, userId) => {
    const accessToken = sessionStorage.getItem('access_token'); 
    const response = await axois.delete(`${POSTS_BASE_URL}/posts/like`, {
        headers: {
            authorization: accessToken
        },
        params: { userId, postId }
    });

    return response.data;
}