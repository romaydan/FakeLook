import { DndProvider } from 'react-dnd';
import Modal from 'react-modal';
import { BrowserRouter } from 'react-router-dom';
import AuthenticationRouter from './components/Routers/AuthenticationRouter';
import PostRouter from './components/Routers/PostRouter';
import SocialRouter from './components/Routers/SocialRouter';
import { HTML5Backend } from 'react-dnd-html5-backend'

Modal.setAppElement('#root');

function App() {
  return (
    <div className='h-full'>
      <DndProvider backend={HTML5Backend}>
        <BrowserRouter>
          <AuthenticationRouter />
          <PostRouter />
          <SocialRouter />
        </BrowserRouter>
      </DndProvider>
    </div>
  );
}

export default App;
