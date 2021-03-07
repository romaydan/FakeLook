import { SET_LOCATION } from '../actions/location.actions';

const initialValue = [34.79037302721541, 32.07336841898681];

const locationReducer = (location = initialValue, action) => {
    switch (action.type) {
        case SET_LOCATION:
            return action.location;
    
        default:
            return location;
    }
}

export default locationReducer;