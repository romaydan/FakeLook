import axios from "axios"
import { getUsersByids } from "../Idenity";

const url = process.env.REACT_APP_SOCIAL_API_URL + 'api/friends/'

export const getUsersFriends = async (userId) => {

    const { data: friendsIds } = await axios.get(url + userId);
    return getUsersByids(friendsIds);
}
export const getUsersBlocks = (userId) => {
    return axios.get(url + 'block/' + userId);

}
export const blockFriend = (userId, friendId) => {
    return axios.patch(`${url}block/${userId}&${friendId}`)
}
export const unblockFriend = (userId, friendId) => {
    return axios.patch(`${url}unblock/${userId}&${friendId}`)
}
export const removeFriend = (userId, friendId) => {
    return axios.delete(`${url}${userId}&${friendId}`, { data: { userId, friendId } })
}


export const getUsersFriendRequests = (userId) => {
    return axios.get(url + 'request/' + userId);
}

export const sendFriendRequest = (userId, recepientId) => {

    return axios.post(url + 'request', { data: { userId, recepientId } })
}

export const acceptFriendRequest = (userId, senderId) => {
    return axios.put(url + 'accept', { data: { userId, senderId } })

}

export const declineFriendRequest = (userId, senderId) => {
    return axios.put(url + 'decline', { data: { userId, senderId } })

}


