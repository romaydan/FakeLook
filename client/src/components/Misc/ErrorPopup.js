import Modal from 'react-modal';
import { RiCloseFill } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { connect } from 'react-redux';
import { clearError } from '../../actions/error.actions';

const ErrorPopup = props => {
    const { error, clearError } = props;

    const [isOpen, setIsOpen] = useState(false);
    const animation = useAnimation();

    useEffect(() => {
        if (error) {
            setIsOpen(true);
            setTimeout(async () => {
                await ascendAnimation();
            }, 250)
        }
    }, [error])

    const ascendAnimation = () => {
        return animation.start({
            y: -20,
            transition: { duration: 1 }
        })
    }

    const descendAnimation = () => {
        return animation.start({
            y: 100,
            transition: { duration: 1 }
        })
    }

    return (
        <Modal overlayClassName='opactiy-0' isOpen={isOpen} className='max-h-fit max-w-fit'>
            <motion.div initial={{ y: 100 }} animate={animation} className='h-20 w-1/2 absolute bottom-2 left-1/4 right-1/4 bg-gray-700 flex flex-row items-center px-3 shadow-lg'>
                <span className='flex-grow text-white'>{error}</span>
                <RiCloseFill className='h-10 w-10 hover:scale-110 transform transition cursor-pointer justify-self-end ml-2 fill-white'
                    onClick={async () => {
                        await descendAnimation();
                        setIsOpen(false);
                        clearError();
                    }} />
            </motion.div>
        </Modal>
    )
}

const mapStateToProps = state => ({
    error: state.error
})

const mapDispatchToProps = dispatch => ({
    clearError: () => dispatch(clearError())
})

export default connect(mapStateToProps, mapDispatchToProps)(ErrorPopup);