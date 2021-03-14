import { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { setError } from '../actions/error.actions';

const useError = () => {

    const { store } = useContext(ReactReduxContext);
    const { _, dispatch } = store;

    return (error) => {
        if(error)
            dispatch(setError(error));
    }
}

export default useError;