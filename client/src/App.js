import Login from './components/Authentication/Login/Login';
import Register from './components/Authentication/Register/Register';
import Map from './components/Posts/Map/Map';
import './App.css';
import Modal from 'react-modal';
import { BrowserRouter } from 'react-router-dom';
import AuthenticationRouter from './components/Routers/AuthenticationRouter';
import PostRouter from './components/Routers/PostRouter';

Modal.setAppElement('#root');

function App() {
  return (
    <div className='h-full'>
      <BrowserRouter>
        <AuthenticationRouter />
        <PostRouter />
      </BrowserRouter>
    </div>
  );
}

export default App;
