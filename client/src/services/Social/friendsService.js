import axios from "axios"

const url = process.env.REACT_APP_SOCIAL_API_URL + 'api/friends/'

export const getUsersFriends = (userId) => {
    return axios.get(url + userId);

}
export const blockFriend = (userId, friendId) => {
    return axios.patch(url + 'block', { data: { userId, friendId } })
}
export const unblockFriend = (userId, friendId) => {
    return axios.patch(url + 'unblock', { data: { userId, friendId } })

}
export const removeFriend = (userId, friendId) => {
    return axios.delete(url, { data: { userId, friendId } })
}
export const getUsersFriendRequests = (userId) => {
    return axios.get(url + 'request/' + userId);
}
export const sendFriendRequest = (userId, recepientId) => {

    return axios.post(url + 'request', { data: { userId, recepientId } })
}
export const acceptFriendRequest = (userId, recepientId) => {
    return axios.post(url + 'accept', { data: { userId, recepientId } })

}
export const declineFriendRequest = (userId, recepientId) => {
    return axios.post(url + 'decline', { data: { userId, recepientId } })

}

const mockFriends = [
    { name: 'yosi', id: '87d5efa2-46ea-4604-86a6-b390f459ba74' },
    { name: 'rami', id: '665b9601-665c-4151-a1b3-9065ca4f13d0' },
    { name: 'bookie', id: '296c06b4-6101-420f-8f00-03566f867f5e' },
    { name: 'nookie', id: '6e236027-bc8d-453f-88b9-6f6651739abc' },
];

