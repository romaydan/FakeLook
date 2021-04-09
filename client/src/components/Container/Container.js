import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router";
import { unauthnticate } from "../../actions/authentication.actions";
import Notifications from '../Notifications/Notifications';

const BUTTON_STYLE = `bg-gradient-to-t from-blue-500 
to-blue-400 text-white border-blue-600 border-0.5 rounded-md w-32 p-1 
self-center hover:bg-gradient-to-t 
hover:from-blue-600 hover:to-blue-500 opacity-75`;

const BUTTON_STYLE_SELECTED = `bg-gradient-to-t from-blue-600 
to-blue-500 text-white border-blue-600 border-0.5 rounded-md w-32 p-1 
self-center hover:bg-gradient-to-t 
hover:from-blue-600 hover:to-blue-500`;

const FithteenMinutesInMilliseconds = 900000;

const Container = props => {
    const { children, unAuthenticate } = props;

    const history = useHistory();
    const [location, setLocation] = useState('/map');

    useEffect(() => {
        let handler;
        const onMouseClickDetected = () => {
            clearTimeout(handler)
            handler = setTimeout(() => {
                console.log('loging out')
                history.push('/logout');
            }, FithteenMinutesInMilliseconds);
        }

        window.addEventListener('click', onMouseClickDetected)

        return () => {
            window.removeEventListener('click', onMouseClickDetected);
            clearTimeout(handler);
        };
    }, [])

    return (
        <div className='h-screen w-screen'>
            <div className='w-full grid grid-cols-3  h-50px bg-gray-300 z-10 border-b-2 border-gray-300 shadow-md justify-between'>
                <button className={BUTTON_STYLE + ' ml-5'} onClick={() => history.push('/logout')}>Logout</button>

                <div className=' self-center flex-row place-self-center'>
                    <button className={(location === '/map' ? BUTTON_STYLE_SELECTED : BUTTON_STYLE) + ' mr-3'}
                        onClick={() => {
                            history.push('/map')
                            setLocation('/map')
                        }}>Map</button>
                    <button className={(location === '/feed' ? BUTTON_STYLE_SELECTED : BUTTON_STYLE) + ' mr-3'}
                        onClick={() => {
                            history.push('/feed')
                            setLocation('/feed')
                        }}>Feed</button>
                    <button className={(location === '/social' ? BUTTON_STYLE_SELECTED : BUTTON_STYLE)}
                        onClick={() => {
                            setLocation('/social')
                            history.push('/social')
                        }}>Social</button>
                </div>
                <Notifications Notifications={[]} className='place-self-center' />
            </div>
            {
                children
            }
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    unAuthenticate: () => dispatch(unauthnticate())
})

export default connect(null, mapDispatchToProps)(Container);