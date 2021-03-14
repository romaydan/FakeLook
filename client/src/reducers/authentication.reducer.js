import { AUTHENTICATED, UNAUTHENTICATE } from "../actions/authentication.actions";

const initialValue = { isAuthenticated: false };

const authenticationReducer = (authentication = initialValue, action) => {
    switch (action.type) {
        case AUTHENTICATED:
            return { accessToken: action.accessToken, isAuthenticated: true };
        case UNAUTHENTICATE:
            return { isAuthenticated: false };
        default:
            return authentication;
    }
}

export default authenticationReducer;