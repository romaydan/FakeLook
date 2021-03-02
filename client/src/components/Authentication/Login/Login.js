import { Formik, Field, ErrorMessage } from 'formik';
import { useMemo } from 'react';
import * as yup from 'yup';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';
import { ReactComponent as FacebookLogo } from '../../../Assets/facebook-app-logo.svg'

const Login = props => {

    const validationSchema = useMemo(() => yup.object({
        email: yup.string().required().email(),
        password: yup.string().required().min(8).max(16)
    }), []);

    const onFacebookResponse = async response => {
        const { data } = await axios.get(`http://localhost:5000/auth/facebook/signin`, {
            headers: {
                facebook_token: response.accessToken,
                facebook_id: response.id
            }
        });

        console.log(data);
    }

    const onGoogleResponse = async response => {
        const { data } = await axios.get('http://localhost:5000/auth/google/signin', {
            headers: {
                token_id: response.tokenId
            }
        });

        console.log(data);
    }

    return (
        <div className='flex flex-row justify-center h-screen'>
            <div className='flex flex-col object-center border-2
         border-gray-300 bg-center w-1/3 p-5 
         self-center rounded-md shadow-xl'>
                <h1 className='self-center text-5xl font-extrabold mb-10 antialiased text-blue-400 text-'>Welcome to FakeLook</h1>
                <Formik
                    validationSchema={validationSchema}
                    initialValues={{ password: '', email: '' }}
                    onSubmit={(values) => {
                        console.log(values);
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
                                render={msg => <div className='text-red-500'>{msg}</div>}/>

                                <label className={'flex flex-row mt-7 w-full border-2 p-1.5 border-gray-300 ' + (errors.password && touched.password ? 'border-red-500' : null)}>
                                    <span className='w-24'>
                                        Password
                                </span>
                                    <Field type='password' name='password' className={'w-full outline-none'} />
                                </label>
                                <ErrorMessage name='password' 
                                render={msg => <div className='text-red-500'>{msg}</div>}/>

                                <button className=' bg-gradient-to-t from-blue-500 
                            to-blue-400 text-white border-blue-600 border-0.5 rounded-md w-32 p-1 
                            self-center hover:bg-gradient-to-t 
                            hover:from-blue-600 hover:to-blue-500
                            mt-7' type='submit' onClick={submitForm}>Log in</button>

                                <span className='flex flex-row justify-around text-xs mt-8'>
                                    <a href='#' className='text-blue-600 font-bold underline'>Forgot password?</a>
                                    <a href='#' className='text-blue-600 font-bold underline'>Don't have an account?</a>
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
                        fields={'name,email,picture'}
                        callback={onFacebookResponse} />
                </div>
            </div>
        </div>
    );
}

// 4c69ba

export default Login;