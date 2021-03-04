import Modal from 'react-modal';
import { BrowserRouter } from 'react-router-dom';
import AuthenticationRouter from './components/Routers/AuthenticationRouter';
import PostRouter from './components/Routers/PostRouter';
import SocialRouter from './components/Routers/SocialRouter';

Modal.setAppElement('#root');

function App() {
  return (
    <div className='h-full'>

      <BrowserRouter>
        <AuthenticationRouter />
        <PostRouter />
        <SocialRouter />
      </BrowserRouter>

    </div>
  );
}

export default App;
