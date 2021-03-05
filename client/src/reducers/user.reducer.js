const { SET_USER, REMOVE_USER } = require("../actions/user.actions");


const userReducer = (user = null, action) => {
    switch (action.type) {
        case SET_USER:
            return action.user;
        case REMOVE_USER:
            return null;
        default:
            return user;
    }
}

export default userReducer;