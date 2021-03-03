import { AiFillLike } from 'react-icons/ai/index';
import { BsPlusCircleFill, BsFillTagFill } from 'react-icons/bs';
import { FaUserTag } from 'react-icons/fa';

const PostView = props => {
    const { post } = props;
    return (
        <div className='flex flex-col max-h-max w-5/6 justify-center'>
            <span className='flex justify-center p-2
             border-4 border-gray-100'>
                <img src={post.imageUrl} className='m-0 object-contain max-h-max' />
            </span>

            <span className='border-gray-100 border-b-4 py-3'>
                { post.textContent }
            </span>

            <span className='w-full flex flex-row border-b-4 border-gray-100 text-xl text-center font-semibold justify-between px-5'>

                <span className='flex felx-row items-center border-gray-100'>
                    <AiFillLike className=' fill-like-blue cursor-pointer h-25px w-25px mr-2 hover:scale-125 transform transition'
                        title={(post.likes?.length ?? 0) + ' likes'} />
                    {post.likes.length}
                </span>

                <span className='flex felx-row items-center m-5'>
                    <FaUserTag className='h-25px w-25px mr-2 cursor-pointer hover:scale-125 transform transition'
                        title={(post.userTags?.length ?? 0) + ' user-tags'} />
                    {post.userTags?.length ?? 0}
                </span>

                <span className='flex-grow-0 flex flex-row items-center'>
                    <BsFillTagFill className='h-25px w-25px mr-2 cursor-pointer hover:scale-125 transform transition'
                        title={(post.tags?.length ?? 0) + ' tags'} />
                    {post.tags?.length ?? 0}
                </span>
            </span>

            <span className='w-full mt-10 h-10 bg-gray-200 rounded-2xl pl-3 flex flex-row justify-items-stretch items-center'>

                <input type='text' className='w-full h-10 outline-none bg-transparent' placeholder='Comment...' />
                <BsPlusCircleFill className='m-5 h-25px w-25px cursor-pointer hover:scale-110 transform transition-transform fill-like-blue' />

            </span>

            <span className='col-span-3 mt-10 max-h-max'>
                {
                    post.comments?.map(comment => (
                        <div className='flex flex-col bg-gray-100 rounded-3xl m-1 p-3'>
                            <span className='font-bold'>{comment.user}</span>
                            <span className='font-semibold'>{comment.content}</span>
                        </div>
                    ))
                }
            </span>
        </div>
    )
}

export default PostView;