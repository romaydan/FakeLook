export const SET_GROUPS = 'SET_GROUPS';
export const ADD_GROUP = 'ADD_GROUP';
export const REMOVE_GROUP = 'REMOVE_GROUP';
export const UPDATE_GROUP = 'UPDATE_GROUP';

export const setGroups = groups => ({
    type: SET_GROUPS,
    groups
})

export const addGroup = group => ({
    type: ADD_GROUP,
    group
})

export const removeGroup = groupId => ({
    type: REMOVE_GROUP,
    groupId
})

export const updateGroup = group => ({
    type: UPDATE_GROUP,
    group
})