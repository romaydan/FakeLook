import { useEffect } from "react";
import { useCookies } from 'react-cookie';
import { connect } from "react-redux";
import { unauthnticate } from "../../../actions/authentication.actions";
import { logout } from '../../../services/Authentication/logout.service';


const Logout = props => {

    const { history, unauthenticate } = props;
    const [cookies, setCookie, removeCookies] = useCookies(['refresh_token'])

    const logOut = () => {
        return logout(cookies.refresh_token);
    }

    useEffect(() => {
        logOut()
            .then(() => {
                removeCookies('refresh_token');
                sessionStorage.removeItem('access_token');
                unauthenticate();
                history.push('/login');
            })
    }, []);


    return (
        <div className='h-screen w-screen text-center'>Loggin Out...</div>
    )
}

const mapDispatchToProps = dispatch => ({
    unauthenticate: () => dispatch(unauthnticate())
})

export default connect(null, mapDispatchToProps)(Logout);