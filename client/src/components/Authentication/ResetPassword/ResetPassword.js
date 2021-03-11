import { Formik, Field, ErrorMessage } from 'formik';
import { NavLink } from 'react-router-dom';
import { useMemo } from 'react';
import * as yup from 'yup';

const RestPassword = props => {

    const validationSchema = useMemo(() => yup.object({
        email: yup.string().email().required(),
        oldPassword: yup.string().min(8, 'password must be between 8-16 characters long').max(16, 'password must be between 8-16 characters long'),
        newPassword: yup.string().required().min(8, 'password must be between 8-16 characters long').max(16, 'password must be between 8-16 characters long').not([yup.ref('oldPassword'), null], 'passwords can not match')
    }), []);

    return (
        <div className='flex flex-row justify-center h-screen'>
            <div className='flex flex-col object-center border-2
         border-gray-300 bg-center w-1/4 p-5 
         self-center rounded-md shadow-xl'>
                <h1 className='self-center text-5xl font-extrabold mb-10 antialiased text-blue-400 text-'>Password Reset</h1>
                <Formik
                    validationSchema={validationSchema}
                    initialValues={{ oldPassword: '', newPassword: '', email: '' }}
                    onSubmit={(values) => {
                        console.log(values);
                    }}>
                    {
                        ({ values, errors, touched, dirty, submitForm }) => (
                            <>
                                <label className={'flex flex-row w-full border-2 p-1.5 border-gray-300 ' + (errors.email && touched.email ? 'border-red-500' : null)}>
                                    <span className='w-36'>
                                        Email
                                    </span>
                                    <Field type='email' name='email' className={'w-full outline-none'} />
                                </label>
                                <ErrorMessage name='email'
                                    render={msg => <div className='text-red-500'>{msg}</div>} />

                                <label className={'flex flex-row mt-7 w-full border-2 p-1.5 border-gray-300 ' + (errors.oldPassword && touched.oldPassword ? 'border-red-500' : null)}>
                                    <span className='w-36'>
                                        Old Password
                                    </span>
                                    <Field type='password' name='oldPassword' className={'w-full outline-none'} />
                                </label>
                                <ErrorMessage name='oldPassword'
                                    render={msg => <div className='text-red-500'>{msg}</div>} />

                                <label className={'flex flex-row mt-7 w-full border-2 p-1.5 border-gray-300 ' + (errors.newPassword && touched.newPassword ? 'border-red-500' : null)}>
                                    <span className='w-36'>
                                        New Password
                                    </span>
                                    <Field type='password' name='newPassword' className={'w-full outline-none'} />
                                </label>
                                <ErrorMessage name='newPassword'
                                    render={msg => <div className='text-red-500'>{msg}</div>} />

                                <button className=' bg-gradient-to-t from-blue-500 
                        to-blue-400 text-white border-blue-600 border-0.5 rounded-md w-32 p-1 
                        self-center hover:bg-gradient-to-t 
                        hover:from-blue-600 hover:to-blue-500
                        mt-7' type='submit' onClick={submitForm}>Reset</button>

                                <span className='flex flex-row justify-around text-xs mt-8'>
                                    <NavLink to='/login'
                                        className='text-blue-600 font-bold underline'>Log in?</NavLink>
                                    <NavLink to='/register'
                                        className='text-blue-600 font-bold underline'>Don't have an account?</NavLink>
                                </span>
                            </>
                        )
                    }
                </Formik>
            </div>
        </div>
    )
}

export default RestPassword;