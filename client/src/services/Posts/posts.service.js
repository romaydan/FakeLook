import * as axois from 'axios';

const POSTS_BASE_URL = process.env.REACT_APP_API_GATEWAY_URL

export const getPosts = async (values) => {
    const accessToken = sessionStorage.getItem('access_token');

    const response = await axois.get(`${POSTS_BASE_URL}/posts`, {
        headers: { authorization: accessToken },
        params: { ...values }
    })

    return response.data;
}

export const getPostByIdAsync = async (postId) => {
    const accessToken = sessionStorage.getItem('access_token');
    const response = await axois.get(`${POSTS_BASE_URL}/posts/${postId}`, {
        headers: { authorization: accessToken }
    });

    return response.data;
}

export const addNewPostAsync = async post => {
    const accessToken = sessionStorage.getItem('access_token');
    const response = await axois.post(`${POSTS_BASE_URL}/posts/add`, post, {
        headers: {
            authorization: accessToken
        }
    })

    return response.data;
}

<<<<<<< HEAD
export const addComment = async (comment, postId) => {
=======
export const addCommentAsync = async (comment, postId) => {
>>>>>>> Ido's-Branch
    const accessToken = sessionStorage.getItem('access_token');
    const response = await axois.post(`${POSTS_BASE_URL}/posts/comment`, { comment, postId }, {
        headers: {
            authorization: accessToken
        }
    });

    return response.data;
}

<<<<<<< HEAD
export const addLike = async (postId, userId) => {
=======
export const addLikeAsync = async (postId, userId) => {
>>>>>>> Ido's-Branch
    const accessToken = sessionStorage.getItem('access_token');
    const response = await axois.post(`${POSTS_BASE_URL}/posts/like`, { userId, postId }, {
        headers: {
            authorization: accessToken
        }
    });

    return response.data;
}

<<<<<<< HEAD
export const removeLike = async (postId, userId) => {
=======
export const removeLikeAsync = async (postId, userId) => {
>>>>>>> Ido's-Branch
    const accessToken = sessionStorage.getItem('access_token');
    const response = await axois.delete(`${POSTS_BASE_URL}/posts/like`, {
        headers: {
            authorization: accessToken
        },
        params: { userId, postId }
    });

    return response.data;
}

export const addTagAsync = async (content, postId) => {
    const accessToken = sessionStorage.getItem('access_token');

    const response = await axois.post(`${POSTS_BASE_URL}/posts/tag`, { tag: { content }, postId }, {
        headers: { authorization: accessToken }
    });

    return response.data;
}

export const addUserTagAsync = async (userId, postId, name) => {
    console.log(userId, postId, name)

    const accessToken = sessionStorage.getItem('access_token');

    const response = await axois.post(`${POSTS_BASE_URL}/posts/usertag`, { userId, name, postId }, {
        headers: { authorization: accessToken }
    });

    return response.data;
}