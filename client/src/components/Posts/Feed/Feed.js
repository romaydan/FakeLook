import Container from "../Container/Container";
import { useState } from 'react';
import { AiFillLike } from 'react-icons/ai/index';
import { connect } from "react-redux";

const Feed = props => {
    const { posts } = props;

    const [post, setPost] = useState();

    const openPostViewModal = (post) => {
        setPost(post);
    }

    return (
        <Container post={post} onModalPostViewClosed={() => setPost(null)}>
            <FeedList posts={posts} postSelectedHandler={openPostViewModal} />
        </Container>
    );
}

const FeedList = props => {
    const { posts, postSelectedHandler } = props;

    return (
        <div className='w-5/6 self-center h-full flex flex-col items-center'>
            {
                posts?.map(post => <Post post={post}
                    onPostSelected={postSelectedHandler} />)
            }
        </div>
    )
}

const Post = props => {
    const { post, onPostSelected } = props;
    return (
        <div className='flex flex-col justify-center w-1/2 h-500px m-2 py-5 px-2 bg-white shadow-md rounded-md cursor-pointer'
            onClick={() => onPostSelected(post)}>
            <div className='font-bold'>{post.publisher}</div>
            <div className=' max-h-95% max-w-full'>
                <img src={post.imageUrl} className=' max-h-full max-w-full m-auto' />
            </div>
            <div className='flex flex-row justify-between items-center mt-1'>
                <small className=''>{'posted at ' + new Date(post.createdAt).toLocaleString()}</small>
                <span className='flex flex-row justify-items-center items-center gap-1'>
                    <AiFillLike className=' fill-like-blue cursor-pointer hover:scale-125 transform transition' />
                    {post.likes.length}
                </span>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    posts: state.posts
});

const mapDispatchToProps = dispatch => ({

}) 

export default connect(mapStateToProps, mapDispatchToProps)(Feed);