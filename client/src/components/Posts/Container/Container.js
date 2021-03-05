import { useEffect, useMemo, useState } from 'react';
import { BiFilter } from 'react-icons/bi';
import { BsFillPlusCircleFill } from 'react-icons/bs';
import { motion, useAnimation } from 'framer-motion';
import { setPosts } from '../../../actions/posts.actions';
import { setLocation } from '../../../actions/location.actions';
import { connect } from 'react-redux';
import { getPosts } from '../../../services/Posts/posts.service';
import { createFakeFriends } from '../../../fake-data/fake.data';
import { addNewPost } from '../../../services/Posts/posts.service';
import Filter from '../Filter/Filter';
import PostForm from '../PostForm/PostForm';
import PostView from '../PostView/PostVIew';
import Modal from 'react-modal';
import Notifications from '../../Notifications/Notifications';
import { setFriends } from '../../../actions/friends.actions';
import { getFriends } from '../../../services/Friends/friends.service';
import '../../../css/scrollbar.css';

const Container = props => {
    const { children, setPosts, post,
        onModalPostViewClosed, user,
        setUserLocation, location,
        friends, setFriends } = props;

    const [filterVisibility, setFilterVisibility] = useState(false);

    const now = new Date()
    const initialFilterValues = useMemo(() => ({
        publishers: [user?.authId],
        from: new Date(new Date().setMonth(now.getMonth() - 1)),
        to: now, distance: 10, tags: [], userTags: [],
    }), []);

    const [postViewModalIsOpen, setPostViewIsOpen] = useState(false);
    const [postFormModalIsOpen, setPostFormIsOpen] = useState(false);

    useEffect(() => {
        if (post)
            setPostViewIsOpen(true);
    }, [post])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords }) => setUserLocation([coords.longitude, coords.latitude]))
        fetchPosts(initialFilterValues);

        if (!friends) {
            getFriends(user.authId)
                .then(friends => {
                    console.log('friends', friends);
                    setFriends(friends);
                })
                .catch(console.error);
        }
    }, []);

    const closePostViewModal = () => {
        setPostViewIsOpen(false);
        onModalPostViewClosed();
    };

    const openPostFormModal = () => setPostFormIsOpen(true);

    const closePosFormModal = () => setPostFormIsOpen(false);

    const filterWidthAnimation = useAnimation();
    const filterVisibilityAnimation = useAnimation();

    const animateFilter = () => filterVisibility ? closeFilterAnimation() : openFilterAnimation();

    const openFilterAnimation = async () => {
        await filterWidthAnimation.start({
            width: '25%',
            transition: {
                delay: 0,
                duration: 0.3
            }
        })
        await filterVisibilityAnimation.start({
            visibility: 'visible'
        });

        setFilterVisibility(!filterVisibility)
    }

    const closeFilterAnimation = async () => {
        await filterVisibilityAnimation.start({
            visibility: 'hidden'
        });
        await filterWidthAnimation.start({
            width: '3rem',
            transition: {
                duration: 0.3
            }
        });

        setFilterVisibility(!filterVisibility)
    }

    const fetchPosts = (values) => {
        getPosts({ ...values, location: location })
            .then(posts => {
                setPosts(posts);
            })
            .catch(console.error);
    }

    const addPost = (post) => {
        console.log(post);
        const form = new FormData();
        form.append('photo', post.image)
        form.append('userTags', post.userTags)
        form.append('tags', post.tags)
        form.append('textContent', post.textContent);
        form.append('coordinates', post.location);
        form.append('showTo', 1);
        addNewPost(form)
            .then(res => setPostFormIsOpen(false));
    }

    return (
        <div className='w-full h-full m-0 flex flex-col' onClick={(e) => e.preventDefault()}>
            <div className='w-full flex flex-row  h-50px bg-gray-300 z-10 border-b-2 border-gray-300 shadow-md justify-end'>
                <Notifications Notifications={[]} className='mr-72' />
            </div>

            <motion.div
                className={'absolute h-full z-10 flex flex-col m-0 bg-gradient-to-t from-blue-500 to-blue-400'}
                animate={filterWidthAnimation}
                initial={{ width: '3rem' }}>
                <BiFilter size={40} fill='white' className='cursor-pointer transform transition-transform hover:scale-125' onClick={animateFilter} />
                <motion.div animate={filterVisibilityAnimation}
                    initial={{ visibility: 'hidden' }}>
                    <Filter friends={friends} initialFilterValues={initialFilterValues} onFilterSubmit={fetchPosts} />
                </motion.div>
            </motion.div>

            <div className='flex overflow-y-auto scrollbar-a'>
                <Modal isOpen={postViewModalIsOpen}
                    onRequestClose={closePostViewModal}
                    className='absolute mr-auto ml-auto right-0 left-0 
                max-h-full bg-gray-50 shadow-md overflow-y-scroll scrollbar-a 
                w-1/2 top-5 bottom-5 outline-none border-2 border-gray-100'>
                    <div className='w-full h-full flex flex-col items-center pt-5 pb-5'>
                        {post ? <PostView post={post} /> : null}
                    </div>
                </Modal>
                <Modal isOpen={postFormModalIsOpen}
                    onRequestClose={closePosFormModal}
                    className='fixed mr-auto ml-auto right-0 left-0 
                max-h-full bg-gray-50 shadow-md overflow-y-auto scrollbar-a 
                w-1/2 top-5 bottom-5 outline-none border-2 border-gray-100'>
                    <div className='w-full h-full flex flex-col items-center pt-5 pb-5'>
                        <PostForm onPostSubmit={addPost} friends={friends} location={location} />
                    </div>
                </Modal>

                <div className={'z-0 m-0 min-w-full h-full max-w-full flex flex-col bg-gray-200 overflow-y-auto'}>
                    {
                        children
                    }
                </div>
                <BsFillPlusCircleFill className='fixed w-100px h-100px right-10 bottom-10 fill-like-blue hover:scale-110 transform transition cursor-pointer'
                    onClick={() => postFormModalIsOpen ? null : openPostFormModal()} title='Add post' />
            </div>
        </div>
    );
}

const mapStateToProps = state => ({
    user: state.user,
    location: state.location,
    friends: state.friends
})

const mapDispatchToProps = dispatch => ({
    setPosts: (posts) => dispatch(setPosts(posts)),
    setUserLocation: location => dispatch(setLocation(location)),
    setFriends: friends => dispatch(setFriends(friends))
})

export default connect(mapStateToProps, mapDispatchToProps)(Container);