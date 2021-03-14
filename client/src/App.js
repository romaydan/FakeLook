import Modal from 'react-modal';
import { useHistory, Route } from 'react-router-dom';
import AuthenticationRouter from './components/Routers/AuthenticationRouter';
import PostRouter from './components/Routers/PostRouter';
import Container from './components/Container/Container';
import SocialRouter from './components/Routers/SocialRouter';
import { connect } from 'react-redux';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { loginWihJwtAsync } from './services/Authentication/login.service';
import { authenticated } from './actions/authentication.actions';
import { setUser } from './actions/user.actions';
import NotFound from './components/Misc/NotFound';
import ErrorPopup from './components/Misc/ErrorPopup';

Modal.setAppElement('#root');

function App({ authentication, setUser, authenticate }) {

  const [cookies, setCookies, removeCookies] = useCookies('refresh_token');
  const history = useHistory();

  const [error, setError] = useState(null);

  const logInWithJwt = () => {
    const token = cookies.refresh_token;

    const path = history.location.pathname;

    if (path === '/login' || path === '/register') {
      return;
    }

    if (token) {
      loginWihJwtAsync(token)
        .then(({ accessToken, user }) => {
          setUser(user);
          authenticate(accessToken);
          history.push(path);
        })
        .catch(err => history.push('/login'))

      return;
    }

    if (path === '/')
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

      <Route path={/[^\s \n].+/} component={NotFound} />

      <ErrorPopup error={error} clearError={() => setError(null)} />

      {/* <Redirect path={'*'} exact to='/404' /> */}

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
