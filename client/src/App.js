import Login from './components/Authentication/Login/Login';
import Register from './components/Authentication/Register/Register';
import Map from './components/Posts/Map/Map';
import './App.css';
import Modal from 'react-modal';
import { BrowserRouter } from 'react-router-dom';
import AuthenticationRouter from './components/Routers/AuthenticationRouter';
import PostRouter from './components/Routers/PostRouter';
import Notifications from './components/Notifications/Notifications';

Modal.setAppElement('#root');

const notifications = [
  {
    message: 'test',
    type: 'post'
  },
  {
    message: 'test',
    type: 'request'
  },
  {
    message: 'test',
    type: 'post'
  },
  {
    message: 'test',
    type: 'request'
  }
]

function App() {
  return (
    <div className='h-full'>
      <BrowserRouter>
        <AuthenticationRouter />
        <PostRouter />
        {/* <div className='flex w-full items-center justify-center'>
          <Notifications notifications={notifications} />
        </div> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
