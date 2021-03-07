import { DndProvider } from 'react-dnd';
import Modal from 'react-modal';
import { BrowserRouter } from 'react-router-dom';
import AuthenticationRouter from './components/Routers/AuthenticationRouter';
import PostRouter from './components/Routers/PostRouter';
import Notifications from './components/Notifications/Notifications';
import Container from './components/Container/Container';
import SocialRouter from './components/Routers/SocialRouter';
import { HTML5Backend } from 'react-dnd-html5-backend'

Modal.setAppElement('#root');


function App() {

  return (
    <div className='h-full'>
      <BrowserRouter>
        <AuthenticationRouter />
        <Container>
          <PostRouter />
          <SocialRouter />
        </Container>
        {/* <div className='flex w-full items-center justify-center'>
          <Notifications notifications={notifications} />
        </div> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
