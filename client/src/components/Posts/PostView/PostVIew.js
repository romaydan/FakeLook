import { useEffect, useRef, useState } from 'react';
import { AiFillLike } from 'react-icons/ai/index';
import { BsPlusCircleFill, BsFillTagFill } from 'react-icons/bs';
import { FaUserTag } from 'react-icons/fa';
import { useHistory } from 'react-router';
import useRefreshToken from '../../../hooks/refresh.hook';
import { addCommentAsync, addLikeAsync, addTagAsync, addUserTagAsync, getPostByIdAsync, removeLikeAsync } from '../../../services/Posts/posts.service';
import notifier from '../../../services/Notifications/Notifications.service';
import Modal from 'react-modal';

const TYPES = {
    ADD_COMMENT: 'ADD_COMMENT',
    REMOVE_COMMENT: 'REMOVE_COMMENT',
    UPDATE_COMMENT: 'UPDATE_COMMENT',

    ADD_LIKE: 'ADD_LIKE',
    REMOVE_LIKE: 'REMOVE_LIKE',

    ADD_TAG: 'ADD_TAG',
    REMOVE_TAG: 'REMOVE_TAG',

    ADD_USERTAG: 'ADD_USERTAG',
    REMOVE_USERTAG: 'REMOVE_USERTAG'
}

const PostView = props => {
    const { postId, user, updatePostLikes, friends } = props;

    const [post, setPost] = useState(null);
    const [isUserTagModalOpen, setIsUserTagModalOpen] = useState(false);
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);

    const commentRef = useRef();
    const history = useHistory();
    const refresh = useRefreshToken();

    const onRefreshFailed = () => {
        history.push('/logout');
    }

    const getPostData = () => {
        getPostByIdAsync(postId)
            .then(post => setPost(post))
            .catch(err => {
                if (err.response?.status === 401) {
                    refresh(getPostData, onRefreshFailed);
                }
            });
    }

    useEffect(() => {
        getPostData();
    }, []);

    useEffect(() => {

        const onNotification = (notification) => {
            const { type, payload } = notification;

            if (post && payload.userId !== user.authId) {
                switch (type) {
                    case TYPES.ADD_COMMENT:
                        setPost({ ...post, comments: [...post.comments, payload.comment] });
                        break;
                    case TYPES.REMOVE_COMMENT:
                        setPost({ ...post, comments: post.comments.filter(c => c.id !== payload.commentId) })
                        break;

                    case TYPES.ADD_LIKE:
                        addLike(payload.like);
                        break;
                    case TYPES.REMOVE_LIKE:
                        removeLike(payload.userId);
                        break;
                    case TYPES.ADD_TAG:
                        setPost({ ...post, tags: [...post.tags, payload.tag] });
                        break;
                    case TYPES.REMOVE_TAG:
                        setPost({ ...post, tags: post.tags.filter(t => t.id !== payload.tagId) });
                        break;

                    case TYPES.ADD_USERTAG:
                        setPost({ ...post, userTags: [...post.userTags, payload.usertag] });;
                        break;
                    case TYPES.REMOVE_USERTAG:
                        setPost({ ...post, userTags: post.userTags.filter(ut => ut.userId !== payload.taggedUserId) });
                        break;
                }
            }
        }

        notifier.subscribe(postId, onNotification);

        return () => notifier.unsubscribe(postId, onNotification);
    }, [post]);

    const comment = (text) => {
        if (text.length > 0) {
            const comment = { content: text, postId, userId: user.authId, name: user.name };

            const addNewComment = () => addCommentAsync(comment, postId)
                .then((newComment) => {
                    console.log('new comment', newComment);
                    setPost({ ...post, comments: [...post.comments, newComment] })
                })
                .catch(err => {
                    if (err.response?.status === 401) {
                        refresh(addNewComment, onRefreshFailed);
                    }
                });

            addNewComment();
        }
    }

    const removeLike = (userId) => {
        const likes = post.likes.filter(like => like.userId !== userId);
        setPost({ ...post, likes: likes })
        updatePostLikes(likes);
    }

    const addLike = (like) => {
        const likes = [...post.likes, like];
        setPost({ ...post, likes: likes })
        updatePostLikes(likes);
    }

    const onLikeClicked = async () => {
        try {
            if (post.likes.find(l => l.userId === user.authId)) {
                const res = await removeLikeAsync(post.id, user.authId);
                removeLike(user.authId);
                return;
            }

            const like = await addLikeAsync(post.id, user.authId);
            addLike(like);
        } catch (error) {
            if (error.response.status === 401) {
                refresh(onLikeClicked, onRefreshFailed);
            }
        }
    }

    const addTag = (content) => {
        addTagAsync(content, postId)
            .then(tag => {
                setPost({ ...post, tags: [...post.tags, tag] });
            })
            .catch(console.error)
    }

    const addUserTag = (userId, name) => {
        addUserTagAsync(userId, postId, name)
            .then(userTag => {
                setPost({ ...post, userTags: [...post.userTags, userTag] });
                console.log('userId', userId, 'name', name);
            })
            .catch(console.error);
    }

    if (post)
        return (
            <div className='flex flex-col max-h-max w-5/6 justify-center'>
                <h1 className='text-2xl font-semibold'>{post.name + (post.publisherId === user.authId ? ' (You)' : '')}</h1>
                <span className='flex justify-center p-2
             border-4 border-gray-100'>
                    <img src={post.imageUrl} className='m-0 object-contain max-h-max' />
                </span>

                <span className='border-gray-100 border-b-4 py-3'>
                    {post.textContent}
                </span>

                <span className='w-full flex flex-row border-b-4 border-gray-100 text-xl text-center font-semibold justify-between px-5'>

                    <span className='flex felx-row items-center border-gray-100'>
                        <AiFillLike className=' fill-like-blue cursor-pointer h-25px w-25px mr-2 hover:scale-125 transform transition'
                            onClick={onLikeClicked}
                            title={(post.likes?.length ?? 0) + ' likes'} />
                        {post.likes.length}
                    </span>

                    <span className='flex felx-row items-center m-5'>
                        <FaUserTag className='h-25px w-25px mr-2 cursor-pointer hover:scale-125 transform transition'
                            title={(post.userTags?.length ?? 0) + ' user-tags'}
                            onClick={() => setIsUserTagModalOpen(!isUserTagModalOpen)} />
                        {post.userTags?.length ?? 0}
                    </span>

                    <span className='flex-grow-0 flex flex-row items-center'>
                        <BsFillTagFill className='h-25px w-25px mr-2 cursor-pointer hover:scale-125 transform transition'
                            title={(post.tags?.length ?? 0) + ' tags'}
                            onClick={() => setIsTagModalOpen(!isTagModalOpen)} />
                        {post.tags?.length ?? 0}
                    </span>
                </span>

                <span className='w-full mt-10 h-10 bg-gray-200 rounded-2xl pl-3 flex flex-row justify-items-stretch items-center'>

                    <input type='text' className='w-full h-10 outline-none bg-transparent' placeholder='Comment...' ref={commentRef} />
                    <BsPlusCircleFill className='m-5 h-25px w-25px cursor-pointer hover:scale-110 transform transition-transform fill-like-blue'
                        onClick={() => {
                            comment(commentRef.current.value);
                            commentRef.current.value = '';
                        }} />

                </span>

                <span className='col-span-3 mt-10 max-h-max'>
                    {
                        post.comments?.map((comment, i) => (
                            <div key={i} className='flex flex-col bg-gray-100 rounded-3xl m-1 p-3'>
                                <span className='font-bold'>{comment.name + (comment.userId === user.authId ? ' (You)' : '')}</span>
                                <span className='font-semibold'>{comment.content}</span>
                            </div>
                        ))
                    }
                </span>

                <UserTagModal isOpen={isUserTagModalOpen} userTags={post.userTags}
                    onCloseRequest={() => setIsUserTagModalOpen(!isUserTagModalOpen)} friends={friends}
                    addUserTag={addUserTag} />

                <TagModal isOpen={isTagModalOpen} tags={post.tags}
                    onCloseRequest={() => setIsTagModalOpen(!isTagModalOpen)} addTag={addTag} />
            </div>
        )

    return (<div className='h-full w-full text-center'>Loading Post...</div>)
}

const ViewModal = props => {
    const { children, isOpen, className, onCloseRequest } = props;

    return (
        <Modal isOpen={isOpen} className={className} onRequestClose={onCloseRequest}>
            {
                children
            }
        </Modal>
    )
}

const UserTagModal = props => {

    const { isOpen, userTags, onCloseRequest, addUserTag, friends } = props;

    const [selectedFriend, setSelectedFriend] = useState(null);

    const tagFriend = () => {
        selectedFriend && addUserTag(selectedFriend.authId, selectedFriend.name);
        setSelectedFriend(null);
    }

    return (
        <ViewModal isOpen={isOpen} className='w-1/3 h-1/2 mx-auto opacity-100 mt-52 border-2 border-gray-50 bg-white shadow-lg outline-none'
            onCloseRequest={() => {
                setSelectedFriend(null);
                onCloseRequest();
            }}>
            <div className='h-full w-full m-2 flex flex-col'>
                <h1 className='font-semibold text-2xl'>User Tags</h1>
                <ul className='w-full mt-5 overflow-y-auto scollbar-a flex-grow'>
                    {
                        userTags?.map((ut, i) => <li className=' bg-blue-400 mr-4 h-10 rounded-md flex items-center pl-2 hover:bg-blue-500 mb-2' key={i}>
                            <span className='font-semibold text-white'>{ut.name}</span>
                        </li>)
                    }
                </ul>
                <hr className='ml-2 mr-4 mb-2' />
                <h1 className='font-semibold text-2xl'>Tag Friend</h1>
                {
                    friends && <div className='w-full flex flex-row mr-5 mb-5 mt-2 justify-self-end flex-grow'>
                        <ul className='flex-grow overflow-x-auto'>
                            {
                                friends?.map((friend, i) => !userTags?.find(ut => ut.userId === friend.authId) &&
                                    <li key={i} className={'bg-gray-100 mb-2 h-10 flex items-center pl-2 hover:bg-gray-200 cursor-pointer rounded-md mr-4 '
                                        + (selectedFriend?.id == friend.id ? 'bg-gray-200' : '')}
                                        onClick={() => setSelectedFriend(friend)}>

                                        <span className='font-semibold flex-grow'>{friend.name}</span>
                                        {
                                            selectedFriend === friend && <BsPlusCircleFill className='h-7 w-7 fill-like-blue ml-2 mr-4 hover:scale-110 transform transition cursor-pointer self-center justify-self-end'
                                                onClick={() => selectedFriend && tagFriend()} title='Tag friend' />
                                        }
                                    </li>)
                            }
                        </ul>

                    </div>
                }
            </div>
        </ViewModal>
    )
}

const TagModal = props => {
    const { isOpen, tags, onCloseRequest, addTag } = props;

    const inputRef = useRef();

    const onAddTag = (content) => {
        if (content && !tags?.find(t => t.content === content)) {
            addTag(content);
        }
    }

    return (
        <ViewModal isOpen={isOpen} className='w-1/3 h-1/2 mx-auto opacity-100 mt-52 border-2 border-gray-50 bg-white shadow-lg outline-none' onCloseRequest={onCloseRequest}>
            <div className='h-full w-full m-2 flex flex-col'>
                <h1 className='font-semibold text-2xl'>Tags</h1>
                <ul className='mt-3 overflow-y-autp mr-2 flex-grow scrollbar-a'>
                    {
                        tags?.map((t, i) => <li key={i}
                            className='h-12 bg-blue-300 mb-2 mr-4 rounded-md flex flex-col justify-center p-2 hover:bg-blue-400'>
                            <span className='text-lg text-white font-semibold'>{'#' + t.content}</span>
                        </li>)
                    }
                </ul>
                <div className='flex flex-row items-center mr-5 justify-self-end mb-5 mt-2'>
                    <input className='bg-gray-200 flex-grow h-8 rounded-md pl-2' placeholder='Add tag...' ref={inputRef} />
                    <BsPlusCircleFill className='h-7 w-7 fill-like-blue ml-2 hover:scale-110 transform transition cursor-pointer'
                        onClick={() => {
                            onAddTag(inputRef.current.value);
                            inputRef.current.value = '';
                        }} />
                </div>
            </div>
        </ViewModal>
    )
}

export default PostView;