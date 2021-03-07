import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import Notifications from '../Notifications/Notifications';

const BUTTON_STYLE = `bg-gradient-to-t from-blue-500 
to-blue-400 text-white border-blue-600 border-0.5 rounded-md w-32 p-1 
self-center hover:bg-gradient-to-t 
hover:from-blue-600 hover:to-blue-500 opacity-75`;

const BUTTON_STYLE_SELECTED = `bg-gradient-to-t from-blue-600 
to-blue-500 text-white border-blue-600 border-0.5 rounded-md w-32 p-1 
self-center hover:bg-gradient-to-t 
hover:from-blue-600 hover:to-blue-500`;


const Container = props => {
    const { children } = props;

    const history = useHistory();
    const [location, setLocation] = useState(history.location.pathname);

    return (
        <div className='h-screen w-screen'>
            <div className='w-full flex flex-row  h-50px bg-gray-300 z-10 border-b-2 border-gray-300 shadow-md justify-evenly'>
                <div className=' self-center flex-row'>
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
                <Notifications Notifications={[]} className='mr-72 justify-self-end place-self-end' />
            </div>
            {
                children
            }
        </div>
    )
}

export default Container;