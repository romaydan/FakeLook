import { refresh } from '../services/Authentication/refresh.service';
import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useCookies } from 'react-cookie';
import { authenticated } from '../actions/authentication.actions';

const useRefreshToken = () => {

    const { store } = useContext(ReactReduxContext);
    const [cookies] = useCookies('refresh_token');

    const { _, dispatch } = store;

    return (onSuccess, onFailure) => {
        if (cookies.refresh_token) {
            refresh(cookies.refresh_token)
                .then(({ accessToken }) => {
                    dispatch(authenticated(accessToken))
                    console.log('New access token');
                    sessionStorage.setItem('access_token', accessToken);
                    onSuccess();
                })
                .catch(onFailure);

            return;
        }

        onFailure();
    }
}

export default useRefreshToken;