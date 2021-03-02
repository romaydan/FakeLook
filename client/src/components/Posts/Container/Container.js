import { useState } from 'react';
import { BiFilter } from 'react-icons/bi';
import { BsFillPlusCircleFill } from 'react-icons/bs';
import Filter from '../Filter/Filter';
import { motion, useAnimation } from 'framer-motion';

const Container = props => {
    const { children, onAddPostClicked } = props;

    const [filterVisibility, setFilterVisibility] = useState(false);

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


    return (
        <div className='w-full h-full m-0 flex'>
            <motion.div
                className={'fixed h-full z-10 flex flex-col m-0 bg-gradient-to-t from-blue-500 to-blue-400'}
                animate={filterWidthAnimation}
                initial={{ width: '3rem' }}>
                <BiFilter size={40} fill='white' className='cursor-pointer transform transition-transform hover:scale-125' onClick={animateFilter} />
                <motion.div animate={filterVisibilityAnimation}
                    initial={{ visibility: 'hidden' }}>
                    <Filter />
                </motion.div>
            </motion.div>
            <div className={'z-0 m-0 min-w-full h-full max-w-full flex flex-col bg-gray-200 overflow-y-auto'}>
                {
                    children
                }
            </div>
            <BsFillPlusCircleFill className='fixed w-100px h-100px right-10 bottom-10 fill-like-blue hover:scale-110 transform transition cursor-pointer'
                onClick={onAddPostClicked} title='Add post'/>
        </div>
    );
}

export default Container;