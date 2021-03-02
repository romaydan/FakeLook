import axios from "axios";
const url = process.env.REACT_APP_SOCIAL_API_URL
export const getUsersGroup = (userId) => {
    // return axios.get(url + userId);
    return mockGroups
}
export const removeGroup = (groupId, userId) => {
    // return axios.delete(url, { data: { groupId, userId } })
    return new Promise((resolve, reject) => {
        resolve(mockGroups.filter(g =>
            g.id !== groupId
        ))
    })
}
export const addNewGroup = (groupId, userId) => {
    return axios.post(url, { data: { groupId, userId } })

}
export const addFriendToGroup = (groupId, userId) => {
    return axios.put(url + '/addfriend', { data: { groupId, userId } })
}
export const removeFriendToGroup = (groupId, userId) => {
    return axios.post(url, { data: { groupId, userId } })
}


const mockGroups = [
    { name: 'diy home', id: '87d5efa2-46ea-4604-86a6-b390f459ba74' },
    { name: 'hey 5 hach tovim', id: '665b9601-665c-4151-a1b3-9065ca4f13d0' },
    { name: 'mamazhik', id: '296c06b4-6101-420f-8f00-03566f867f5e' },
    { name: 'zorzors', id: '6e236027-bc8d-453f-88b9-6f6651739abc' },
];
