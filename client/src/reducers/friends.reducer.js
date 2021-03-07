import { SET_FRIENDS } from '../actions/friends.actions';

const initialValue = null;

const friendsReducer = (friends = initialValue, action) => {
    switch (action.type) {
        case SET_FRIENDS:
            return action.friends;
    
        default:
            return friends;
    }
}

export default friendsReducer;