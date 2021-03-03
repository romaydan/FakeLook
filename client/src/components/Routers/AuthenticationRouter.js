import { Switch, Route } from 'react-router-dom';
import Login from '../Authentication/Login/Login';
import Register from '../Authentication/Register/Register';

const AuthenticationRouter = props => {

    return (
        <Switch>
            <Route component={Login} path='/login'/>
            <Route component={Register} path='/register'/>
        </Switch>
    )
}

export default AuthenticationRouter;