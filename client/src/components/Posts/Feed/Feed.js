import Container from "../Container/Container";
import { useState } from 'react';
import { AiFillLike } from 'react-icons/ai/index';
import { connect } from "react-redux";
import { addLike } from "../../../services/Posts/posts.service";
import { setPosts } from "../../../actions/posts.actions";

const Feed = props => {
    const { posts, setPosts, user } = props;

    const [post, setPost] = useState();

    const openPostViewModal = (post) => {
        setPost(post);
    }

    const updatePost = (post) => {
        const index = posts.findIndex(p => p.id === post.id);
        if (index) {
            posts[index] = post;
            setPosts([...posts])
        }
    }

    return (
        <Container post={post} posts={posts} onModalPostViewClosed={() => setPost(null)} updatePost={updatePost}>
            <FeedList posts={posts} postSelectedHandler={openPostViewModal} userId={user.authId} />
        </Container>
    );
}

const FeedList = props => {
    const { posts, postSelectedHandler, userId } = props;

    return (
        <div className='h-screen overflow-y-scroll'>
            <div className='w-full self-center flex flex-col items-center'>
                {
                    posts?.map(post => <Post post={post}
                        onPostSelected={postSelectedHandler} userId={userId} />)
                }
            </div>
            <div className='h-96 flex justify-center items-center'>
                <span className='text-xl text-gray-400 font-serif'>Fin.</span>
            </div>
        </div>
    )
}

const Post = props => {
    const { post, onPostSelected, userId } = props;

    return (
        <div className='flex flex-col justify-center w-1/2 h-500px m-2 py-5 px-2 bg-white shadow-md rounded-md cursor-pointer'
            onClick={() => onPostSelected(post)}>
            <div className='font-bold'>{post.publisher + (post.publisherId === userId ? ' (You)' : '')}</div>
            <div className=' max-h-95% max-w-full'>
                <img src={post.imageUrl} className=' max-h-full max-w-full m-auto' />
            </div>
            <div className='flex flex-row justify-between items-center mt-1'>
                <small className=''>{'posted at ' + new Date(post.createdAt).toLocaleString()}</small>
                <span className='flex flex-row justify-items-center items-center gap-1'>
                    <AiFillLike className=' fill-like-blue' />
                    {post.likes.length}
                </span>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    posts: state.posts,
    user: state.user
});

const mapDispatchToProps = dispatch => ({
    setPosts: posts => dispatch(setPosts(posts))
})

export default connect(mapStateToProps, mapDispatchToProps)(Feed);