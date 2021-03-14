import { SET_GROUPS, ADD_GROUP, REMOVE_GROUP, UPDATE_GROUP } from '../actions/groups.actions';

const initialValue = null;

const groupsReducer = (groups = initialValue, action) => {
    switch (action.type) {
        case SET_GROUPS:
            return action.groups;

        case ADD_GROUP:
            return [...groups, action.group];

        case REMOVE_GROUP:
            return groups.filter(g => g.id !== action.groupId);

        case UPDATE_GROUP:
            const index = groups.findIndex(g => g.id === action.group.id);
            if (index >= 0) {
                groups[index] = action.group;
            }
            return [...groups];

        default:
            return groups;
    }
}

export default groupsReducer;