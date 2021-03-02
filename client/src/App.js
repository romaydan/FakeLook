import Login from './components/Authentication/Login/Login';
import Register from './components/Authentication/Register/Register';
import Map from './components/Posts/Map/Map';
import './App.css';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function App() {
  return (
    <div className='h-full'>
      <Register/>
    </div>
  );
}

export default App;
