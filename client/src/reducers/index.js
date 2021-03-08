import { combineReducers } from 'redux';
import postsReducer from './posts.reducer';
import locationReducer from './location.reducer';
import userReducer from './user.reducer';
import friendsReducer from './friends.reducer';
import authenticationReducer from './authentication';

export default combineReducers({
    posts: postsReducer,
    user: userReducer,
    location: locationReducer,
    friends: friendsReducer,
    authentication: authenticationReducer
})