import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { IoIosNotifications, IoMdClose } from 'react-icons/io';
import { AiFillCheckCircle, AiFillCloseCircle } from 'react-icons/ai';
import service from '../../services/Notifications/Notifications.service';

const Notifications = props => {
    const { notifications, className } = props;

    const [visibility, setVisibility] = useState(false);
    const [displayNotifications, setDisplayNotifications] = useState(notifications);
    const animation = useAnimation();

    useEffect(() => {
        service.connect();
        service.subscribe('notification', (notification) => {
            setDisplayNotifications([...displayNotifications, notification]);
        });

        return () => service.disconnect();
    }, [])

    const animate = async () => {
        await animation.start({
            rotate: 10,
            transition: {
                duration: 0.2
            }
        })

        await animation.start({
            rotate: -10,
            transition: {
                duration: 0.2
            }
        })

        await animation.start({
            rotate: 0,
            transition: {
                duration: 0.2
            }
        })
    }

    return (
        <div className={"relative block place-items-center place-content-center " + className}>
            <div className='overflow-x-hidden overflow-y-hidden min-w-full max-w-lg'>
                <motion.div onHoverStart={animate} animate={animation}>
                    <IoIosNotifications className='w-50px h-50px fill-like-blue outline-none cursor-pointer'
                        onClick={() => setVisibility(!visibility)}
                        onBlur={() => {
                            console.log('blur')
                        }} />
                </motion.div>
                <div className={`absolute z-10 shadow-lg border-4 border-gray-200 
                rounded-md mt-1 w-600px max-h-72 min-h-50px left-1/2 -translate-x-1/2 transform 
                overflow-y-auto overflow-x-hidden scrollbar-a bg-gray-100 ` + (visibility ? '' : 'hidden')}>
                    {
                        displayNotifications?.length > 0 ?
                            displayNotifications.map(n => n.type === 'post' ? <PostNotification notification={n}
                                onNotificationDissmised={() => setDisplayNotifications(displayNotifications.filter(notif => notif !== n))} />
                                : <FriendRequest notification={n}
                                    onAccept={() => setDisplayNotifications(displayNotifications.filter(notif => notif !== n))}
                                    onDecline={() => setDisplayNotifications(displayNotifications.filter(notif => notif !== n))} />)
                            : <div className='w-full text-center mt-1 text-2xl font-semibold text-gray-300'>Nothing left to show...</div>
                    }
                </div>
            </div>
        </div >
    )
}

const PostNotification = props => {
    const { notification, onNotificationDissmised } = props;

    return (
        <div className='max-w-full bg-gray-100 mx-2 h-20 my-2 rounded-md shadow-md flex flex-row'>
            <span className='ml-2 self-center flex-grow'>
                {
                    notification.message
                }
            </span>
            <AiFillCloseCircle className=' h-35px w-35px cursor-pointer fill-red hover:scale-110 transform transition rounded-md self-center mr-2'
                onClick={onNotificationDissmised} title={'Close notification'} />
        </div>
    )
}

const FriendRequest = props => {
    const { notification, onAccept, onDecline } = props;
    return <div className='max-w-full bg-gray-100 mx-2 h-20 my-2 rounded-md shadow-md flex flex-row'>
        <span className='ml-2 self-center flex-grow'>
            {
                notification.message
            }
        </span>
        <span className='flex flex-row self-center m-2'>
            <AiFillCheckCircle className=' h-35px w-35px mr-5 cursor-pointer fill-like-blue hover:scale-110 transform transition rounded-md'
                onClick={onAccept} title={'Accept request'} />
            <AiFillCloseCircle className=' h-35px w-35px cursor-pointer fill-red hover:scale-110 transform transition rounded-md'
                onClick={onDecline} title={'Decline request'} />
        </span>
    </div>
}

export default Notifications;