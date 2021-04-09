import * as axios from 'axios';

const url = process.env.REACT_APP_API_GATEWAY_URL + '/friends'

export const getFriendsAsync = async (userId, accessToken) => {  
    console.log(url)

    const { data: friends } = await axios.get(`${url}/all`, {
        headers: {
            authorization: accessToken
        },
        params: {
            userId
        }
    })

    return friends;
}

export const getUsersByName = async (userId, name) => {
    const accessToken = sessionStorage.getItem('access_token');
    const { data: foundFriends } = await axios.get(url + '/name', {
        headers: {
            authorization: accessToken
        },
        params: {
            name, userId
        }
    })
    return foundFriends
}
export const removeFriend = async (userId, friendId) => {
    const accessToken = sessionStorage.getItem('access_token');
    try {
        const res = await axios.delete(url, {
            headers: {
                authorization: accessToken
            },
            params: {
                userId,
                friendId
            }

        })
        return res
    } catch (error) {
        console.log('error in removeFriend', error.message)
    }

}


export const blockFriend = async (userId, friendId) => {
    const accessToken = sessionStorage.getItem('access_token');
    const res = await axios.patch(url + '/block', {
        headers: {
            authorization: accessToken
        },
        data: {
            userId,
            friendId
        }

    })
    console.log(res)
    return res;
}


export const unblockFriend = async (userId, friendId) => {
    const accessToken = sessionStorage.getItem('access_token');
    const res = await axios.patch(url + '/unblock', {
        headers: {
            authorization: accessToken
        },
        data: {
            userId,
            friendId
        }

    })
    console.log(res)
    return res;
}
export const getRequests = async (userId) => {
    console.log('userId', userId)
    const accessToken = sessionStorage.getItem('access_token');
    const res = await axios.get(url + '/request', {
        headers: {
            authorization: accessToken
        },
        params: {
            userId
        }

    })
    return res;
}
export const sendFriendRequest = (userId, recepientId) => {
    const accessToken = sessionStorage.getItem('access_token');
    return axios.post(url + '/request', {
        headers: {
            authorization: accessToken
        }, data: { userId, recepientId }
    })
}

export const acceptFriendRequest = (userId, senderId) => {
    const accessToken = sessionStorage.getItem('access_token');
    return axios.patch(url + '/request/accept', {
        headers: {
            authorization: accessToken
        }, data: { userId, senderId }
    })

}

export const declineFriendRequest = (userId, senderId) => {
    const accessToken = sessionStorage.getItem('access_token');
    return axios.patch(url + '/request/decline', {
        headers: {
            authorization: accessToken
        }, data: { userId, senderId }
    })

}
