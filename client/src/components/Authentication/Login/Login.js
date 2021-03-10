import { Formik, Field, ErrorMessage } from 'formik';
import { useMemo } from 'react';
import * as yup from 'yup';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { facebookLogin, fakelookLogin, googleLogin } from '../../../services/Authentication/login.service';
import { NavLink } from 'react-router-dom';
import { setUser } from '../../../actions/user.actions';
import { connect } from 'react-redux';
import { authenticated } from '../../../actions/authentication.actions';
import { useCookies } from 'react-cookie';

const Login = props => {
    const { history, setUser, authenticate } = props;

    const [cookies, setCookie] = useCookies(['refresh_token'])

    const validationSchema = useMemo(() => yup.object({
        email: yup.string().required().email(),
        password: yup.string().required().min(8).max(16)
    }), []);

    const login = (user, accessToken, refreshToken) => {
        sessionStorage.setItem('access_token', accessToken);
        setCookie('refresh_token', refreshToken);

        setUser(user);
        authenticate(accessToken);
        history.push('/map');
    }

    const onFacebookResponse = async response => {
        const { id: facebookId, accessToken } = response;
        facebookLogin(accessToken, facebookId)
            .then(({ user, accessToken, refreshToken }) => {
                login(user, accessToken, refreshToken);
            })
            .catch(console.error);
    }

    const onGoogleResponse = response => {
        const { tokenId } = response;
        googleLogin(tokenId)
            .then(({ user, accessToken, refreshToken }) => {
                login(user, accessToken, refreshToken);
            })
            .catch(console.error);
    }

    const facelookLogin = (email, password) => {
        fakelookLogin(email, password)
            .then(({ user, accessToken, refreshToken }) => {
                login(user, accessToken, refreshToken);
            })
            .catch(err => console.error('error', err))
    }

    return (
        <div className='flex flex-row justify-center h-screen'>
            <div className='flex flex-col object-center border-2
         border-gray-300 bg-center w-1/4 p-5 
         self-center rounded-md shadow-xl'>
                <h1 className='self-center text-5xl font-extrabold mb-10 antialiased text-blue-400 text-'>Welcome to FakeLook</h1>
                <Formik
                    validationSchema={validationSchema}
                    initialValues={{ password: '', email: '' }}
                    onSubmit={(values) => {
                        facelookLogin(values.email, values.password)
                    }}>
                    {
                        ({ values, errors, touched, dirty, submitForm }) => (
                            <>
                                <label className={'flex flex-row w-full border-2 p-1.5 border-gray-300 ' + (errors.email && touched.email ? 'border-red-500' : null)}>
                                    <span className='w-24'>
                                        Email
                                </span>
                                    <Field type='email' name='email' className={'w-full outline-none'} />
                                </label>
                                <ErrorMessage name='email'
                                    render={msg => <div className='text-red-500'>{msg}</div>} />

                                <label className={'flex flex-row mt-7 w-full border-2 p-1.5 border-gray-300 ' + (errors.password && touched.password ? 'border-red-500' : null)}>
                                    <span className='w-24'>
                                        Password
                                </span>
                                    <Field type='password' name='password' className={'w-full outline-none'} />
                                </label>
                                <ErrorMessage name='password'
                                    render={msg => <div className='text-red-500'>{msg}</div>} />

                                <button className=' bg-gradient-to-t from-blue-500 
                            to-blue-400 text-white border-blue-600 border-0.5 rounded-md w-32 p-1 
                            self-center hover:bg-gradient-to-t 
                            hover:from-blue-600 hover:to-blue-500
                            mt-7' type='submit' onClick={submitForm}>Log in</button>

                                <span className='flex flex-row justify-around text-xs mt-8'>
                                    <NavLink to='/'
                                        className='text-blue-600 font-bold underline'>Forgot password?</NavLink>
                                    <NavLink to='/register'
                                        className='text-blue-600 font-bold underline'>Don't have an account?</NavLink>
                                </span>
                            </>
                        )
                    }
                </Formik>
                <h3 className='self-center mt-12'>Or login with: </h3>
                <div className='flex flex-row justify-evenly m-5 content-end h-10 mt-6'>
                    <GoogleLogin className='rounded-md'
                        clientId={'332337525586-rpk6kqpc36ja5st3dsc40g8593e5kjkj.apps.googleusercontent.com'}
                        buttonText={'Login with Google'}
                        onSuccess={onGoogleResponse} />
                    <FacebookLogin
                        cssClass='w-44 p-1.5 bg-facebook text-white 
                    rounded-md self-center shadow-md h-10 self-center'
                        appId={'453933415731261'}
                        textButton={'Login with Facebook'}
                        autoLoad={false}
                        fields={'name,email,picture'}
                        callback={onFacebookResponse} />
                </div>
            </div>
        </div>
    );
}

const mapDispatchToProps = dispatch => ({
    setUser: user => dispatch(setUser(user)),
    authenticate: accessToken => dispatch(authenticated(accessToken))
})

export default connect(null, mapDispatchToProps)(Login);