import Container from "../Posts/Container/Container";
import { createFakeFriends, createFakePosts } from '../../fake-data/fake.data';
import { useState } from 'react';
import { AiFillLike } from 'react-icons/ai/index';
import PostView from '../PostView/PostVIew';
import PostForm from '../PostForm/PostForm';
import Modal from 'react-modal';

const Feed = props => {
    const [post, setPost] = useState();
    const [postViewModalIsOpen, setPostViewIsOpen] = useState(false);
    const [postFormModalIsOpen, setPostFormIsOpen] = useState(false);

    const openPostViewModal = (post) => {
        setPost(post);
        setPostViewIsOpen(true);
    }

    const openPostFormModal = () => setPostFormIsOpen(true);

    const closePostViewModal = () => setPostViewIsOpen(false);

    const closePosFormModal = () => setPostFormIsOpen(false);

    return (
        <Container onAddPostClicked={() => openPostFormModal()}>
            <Modal isOpen={postViewModalIsOpen}
                onRequestClose={closePostViewModal}
                className='absolute mr-auto ml-auto right-0 left-0 
                max-h-full bg-gray-50 shadow-md overflow-y-scroll scrollbar-a 
                w-1/2 top-5 bottom-5 outline-none border-2 border-gray-100'>
                <div className='w-full h-full flex flex-col items-center pt-5 pb-5'>
                    <PostView post={post} />
                </div>
            </Modal>
            <Modal isOpen={postFormModalIsOpen}
                onRequestClose={closePosFormModal}
                className='absolute mr-auto ml-auto right-0 left-0 
                max-h-full bg-gray-50 shadow-md overflow-y-auto scrollbar-a 
                w-1/2 top-5 bottom-5 outline-none border-2 border-gray-100'>
                <div className='w-full h-full flex flex-col items-center pt-5 pb-5'>
                    <PostForm friends={createFakeFriends()} />
                </div>
            </Modal>

            <FeedList posts={createFakePosts()} postSelectedHandler={openPostViewModal} />
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
        <div className='flex flex-col justify-center w-1/2 h-500px m-2 p-2 bg-white shadow-md rounded-md cursor-pointer'
            onClick={() => onPostSelected(post)}>
            <div className='font-bold'>{post.publisher}</div>
            <div className='container w-full h-full'>
                <img src={post.imageUrl} className='max-w-full max-h-full min-w-max min-h-full m-auto' />
            </div>
            <div className='flex flex-row justify-between items-center mt-1'>
                <small className=''>{post.createdAt.toLocaleString()}</small>
                <span className='flex flex-row justify-items-center items-center gap-1'>
                    <AiFillLike className=' fill-like-blue cursor-pointer hover:scale-125 transform transition' />
                    {post.likes.length}
                </span>
            </div>
        </div>
    )
}

export default Feed;