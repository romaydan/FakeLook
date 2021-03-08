import Modal from 'react-modal';
import { BrowserRouter, useHistory } from 'react-router-dom';
import AuthenticationRouter from './components/Routers/AuthenticationRouter';
import PostRouter from './components/Routers/PostRouter';
import Container from './components/Container/Container';
import SocialRouter from './components/Routers/SocialRouter';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { loginWihJwt } from './services/Authentication/login.service';
import { accessToken } from 'mapbox-gl';
import { authenticated } from './actions/authentication.actions';
import { setUser } from './actions/user.actions';

Modal.setAppElement('#root');


function App({ authentication, setUser, authenticate }) {

  const [cookies, setCookies, removeCookies] = useCookies('refresh_token');
  const history = useHistory();

  const logInWithJwt = () => {
    const token = cookies.refresh_token;

    if (history.location.pathname === '/login') {
      return;
    }

    if (token) {
      loginWihJwt(token)
        .then(({ accessToken, user }) => {
          setUser(user);
          authenticate(accessToken);
          history.push('/map');
        })
        .catch(err => history.push('/login'))

      return;
    }

    history.push('/login')
  }

  useEffect(() => {
    logInWithJwt();
  }, [])

  return (
    <div className='h-full'>
      <AuthenticationRouter />
      {
        authentication.isAuthenticated &&
        <Container>
          <PostRouter />
          <SocialRouter />
        </Container>
      }
      {/* <div className='flex w-full items-center justify-center'>
          <Notifications notifications={notifications} />
        </div> */}
    </div>
  );
}

const mapStateToProps = state => ({
  authentication: state.authentication
});

const mapDispatchToProps = dispatch => ({
  authenticate: (accessToken) => dispatch(authenticated(accessToken)),
  setUser: (user) => dispatch(setUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
