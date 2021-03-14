import * as axios from 'axios';

const API_GATEWAY_URL = 'http://localhost:5000';

export const getGroupsAsync = async (userId, accessToken) => {
    const response = await axios.get(`${API_GATEWAY_URL}/groups/${userId}`, {
        headers: { authorization: accessToken }
    })

    return response.data;
}