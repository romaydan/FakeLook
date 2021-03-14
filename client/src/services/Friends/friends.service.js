import * as axios from 'axios';

export const getFriendsAsync = async (userId, accessToken) => {
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