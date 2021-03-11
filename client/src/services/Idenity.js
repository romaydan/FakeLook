import axios from "axios"

const url = process.env.REACT_APP_IDENITY_API_URL + 'api/users/'
export const getUsersByName = async (name) => {
    return await axios.get(url + `name/${name}`)
}
export const getUsersByids = async (ids) => {
    return await axios.put(url, { data: { userIds: [...ids] } })

}