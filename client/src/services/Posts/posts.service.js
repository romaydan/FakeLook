import * as axois from 'axios';

const POSTS_BASE_URL = 'http://localhost:5000'

export const getPostsAsync = async (values, accessToken) => {
    const response = await axois.get(`${POSTS_BASE_URL}/posts`, {
        headers: { authorization: accessToken },
        params: { ...values }
    })

    return response.data;
}

export const getPostByIdAsync = async (postId, accessToken) => {
    const response = await axois.get(`${POSTS_BASE_URL}/posts/${postId}`, {
        headers: { authorization: accessToken }
    });

    return response.data;
}

export const addNewPostAsync = async (post, accessToken) => {
    const response = await axois.post(`${POSTS_BASE_URL}/posts/add`, post, {
        headers: {
            authorization: accessToken
        }
    })

    return response.data;
}

export const addCommentAsync = async (comment, postId, accessToken) => {
    const response = await axois.post(`${POSTS_BASE_URL}/posts/comment`, { comment, postId }, {
        headers: {
            authorization: accessToken
        }
    });

    return response.data;
}

export const addLikeAsync = async (postId, userId, accessToken) => {
    const response = await axois.post(`${POSTS_BASE_URL}/posts/like`, { userId, postId }, {
        headers: {
            authorization: accessToken
        }
    });

    return response.data;
}

export const removeLikeAsync = async (postId, userId, accessToken) => {
    const response = await axois.delete(`${POSTS_BASE_URL}/posts/like`, {
        headers: {
            authorization: accessToken
        },
        params: { userId, postId }
    });

    return response.data;
}

export const addTagAsync = async (content, postId, accessToken) => {
    const response = await axois.post(`${POSTS_BASE_URL}/posts/tag`, { tag: { content }, postId }, {
        headers: { authorization: accessToken }
    });

    return response.data;
}

export const addUserTagAsync = async (userId, postId, name, accessToken) => {
    const response = await axois.post(`${POSTS_BASE_URL}/posts/usertag`, { userId, name, postId }, {
        headers: { authorization: accessToken }
    });

    return response.data;
}