import { Switch, Route } from 'react-router-dom';
import Login from '../Authentication/Login/Login';
import Logout from '../Authentication/Logout/Logout';
import Register from '../Authentication/Register/Register';
import ResetPassword from '../Authentication/ResetPassword/ResetPassword';

const AuthenticationRouter = props => {

    return (
        <Switch>
            <Route component={Login} path='/login'/>
            <Route component={Logout} path='/logout'/>
            <Route component={Register} path='/register'/>
            <Route component={ResetPassword} path='/reset'/>
        </Switch>
    )
}

export default AuthenticationRouter;