import { CLEAR_ERROR, SET_ERROR } from "../actions/error.actions";

const initialValue = null;

const errorReducer = (error = initialValue, action) => {
    switch (action.type) {
        case SET_ERROR:
            return action.error;
        case CLEAR_ERROR:
            return null;
        default:
            return error;
    }
}

export default errorReducer;