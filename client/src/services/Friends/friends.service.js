import * as axios from 'axios';

export const getFriends = async (userId) => {
    const accessToken = sessionStorage.getItem('access_token');

    const { data: friends } = await axios.get('http://localhost:5000/friends/all', {
        headers: {
            authorization: accessToken
        },
        params: {
            userId
        }
    })

    return friends;
}