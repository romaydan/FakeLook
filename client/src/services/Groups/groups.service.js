import axios from "axios";
const url = process.env.REACT_APP_API_GATEWAY_URL + '/groups'

export const getGroup = async (groupId, userId) => {
    const accessToken = sessionStorage.getItem('access_token');
    const { data } = await axios.get(url + '/', {
        headers: {
            authorization: accessToken
        },
        params: {
            groupId, userId
        }

    })
    data.friends = data.friends.filter(gf => gf.id !== userId)
    return data;
}

export const getUsersGroup = async (userId) => {
    const accessToken = sessionStorage.getItem('access_token');
    const { data: groups } = await axios.get(url + '/user', {
        headers: {
            authorization: accessToken
        },
        params: {
            userId
        }

    })
    return groups;
}

export const deleteGroup = async (groupId, userId) => {
    const accessToken = sessionStorage.getItem('access_token');
    const res = await axios.delete(url, {
        headers: {
            authorization: accessToken
        },
        params: {
            userId, groupId
        }

    })
    return res;
}
export const addNewGroup = async (userId, name) => {
    const accessToken = sessionStorage.getItem('access_token');
    const res = await axios.post(url, {
        headers: {
            authorization: accessToken
        },
        data: {
            userId, name
        }

    })
    return res;
}

export const changeGroupName = async (groupId, userId, name) => {

    const accessToken = sessionStorage.getItem('access_token');
    const res = await axios.put(url, {
        headers: {
            authorization: accessToken
        },
        params: {
            groupId, userId, name
        }

    })
    return res;
}

export const addFriendToGroup = async (userId, groupId, friendId) => {

    const accessToken = sessionStorage.getItem('access_token');
    const res = await axios.put(url + '/add', {
        headers: {
            authorization: accessToken
        },
        data: {
            groupId, userId, friendId
        }

    })
    return res;
}

export const removeFriendFromGroup = async (groupId, userId, friendId) => {
    const accessToken = sessionStorage.getItem('access_token');
    const res = await axios.put(url + '/remove', {
        headers: {
            authorization: accessToken
        },
        data: {
            groupId, userId, friendId
        }
    })
    return res;
}