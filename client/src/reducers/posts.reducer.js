import { ADD_POSTS, SET_POSTS } from "../actions/posts.actions";
import { createFakePosts } from "../fake-data/fake.data";

const initialState = createFakePosts();

const postsReducer = (posts = initialState, action) => {
    switch (action.type) {
        case SET_POSTS:
            return [...action.posts];
        default:
            return posts;
    }
}

export default postsReducer;