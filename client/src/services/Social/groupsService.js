import axios from "axios";
const url = process.env.REACT_APP_SOCIAL_API_URL + 'api/groups/'

export const getGroup = (groupId) => {
    return axios.get(url + groupId);
}

export const getUsersGroup = (userId) => {
    return axios.get(url + 'user/' + userId);
}

export const removeGroup = (groupId, userId) => {
    return axios.delete(url, { data: { groupId, userId } })
}

export const addNewGroup = (userId, name) => {
    return axios.post(url, { data: { userId, name } })
}
export const deleteGroup = (groupId, userId) => {
    return axios.delete(`${url}${userId}&${groupId}`)
}

export const changeGroupName = (groupId, userId, name) => {
    return axios.put(url + '/name', { data: { groupId, userId, name } })
}

export const addFriendToGroup = (userId, groupId, friendId) => {
    return axios.put(url + 'addfriend', { data: { groupId, userId, friendId } })
}

export const removeFriendFromGroup = (groupId, userId, friendId) => {
    return axios.put(url + 'removeFriend', { data: { groupId, userId, friendId } })
}



