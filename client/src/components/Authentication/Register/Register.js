import { Formik, Field } from 'formik';
import { useMemo } from 'react';
import * as yup from 'yup';

const Register = props => {

    const validationSchema = useMemo(() => yup.object({
        email: yup.string().required().email(),
        password: yup.string().required().min(8).max(16),
        confirmPassword: yup.string().required().oneOf([yup.ref('password'), null])
    }), []);

    return (
        <div className='flex flex-row justify-center h-screen'>
            <div className='flex flex-col object-center border-2
         border-gray-300 bg-center w-1/3 p-5 
         self-center rounded-md shadow-xl'>
                <h1 className='self-center text-5xl font-extrabold mb-10 antialiased text-blue-400 text-'>Welcome to FakeLook</h1>
                <Formik
                    validationSchema={validationSchema}
                    initialValues={{ password: '', confirmPassword: '', email: '', address: { street: '', city: '', country: '', houseNo: '', aptNo: '' } }}
                    onSubmit={(values) => {
                        console.log(values);
                    }}>
                    {
                        ({ values, errors, touched, submitForm, dirty }) => (
                            <>
                                <label className={'flex flex-row mb-7 w-full border-2 p-1.5 border-gray-300 ' + (errors.email && touched.email && dirty ? 'border-red-500' : null)}>
                                    <span className='w-44'>
                                        Email
                                </span>
                                    <Field type='email' name='email' className={'w-full outline-none '} />
                                </label>
                                <label className={'flex flex-row mb-7 w-full border-2 p-1.5 border-gray-300 ' + (errors.password && touched.password && dirty ? 'border-red-500' : null)}>
                                    <span className='w-44'>
                                        Password
                                </span>
                                    <Field type='password' name='password' className={'w-full outline-none '} />
                                </label>
                                <label className={'flex flex-row mb-7 w-full border-2 p-1.5 border-gray-300 ' + (errors.confirmPassword && touched.confirmPassword && dirty ? 'border-red-500' : null)}>
                                    <span className='w-44'>
                                        Confirm Password
                                </span>
                                    <Field type='password' name='confirmPassword' className={'w-full outline-none '} />
                                </label>

                                <div className='grid grid-cols-2'>
                                    <label className={'flex flex-row mb-7 w-full border-2 p-1.5 border-gray-300 ' + (errors.confirmPassword && touched.confirmPassword && dirty ? 'border-red-500' : null)}>
                                        <span className='w-44'>
                                            Street
                                </span>
                                    </label>
                                    <label className={'flex flex-row mb-7 w-full border-2 p-1.5 border-gray-300 ' + (errors.confirmPassword && touched.confirmPassword && dirty ? 'border-red-500' : null)}>
                                        <span className='w-44'>
                                            City
                                </span>
                                        <Field type='password' name='confirmPassword' className={'w-full outline-none '} />
                                    </label>

                                    <label className={'flex flex-row mb-7 w-full border-2 p-1.5 border-gray-300 ' + (errors.confirmPassword && touched.confirmPassword && dirty ? 'border-red-500' : null)}>
                                        <span className='w-44'>
                                            Country
                                </span>
                                        <Field type='password' name='confirmPassword' className={'w-full outline-none '} />
                                    </label>

                                    <label className={'flex flex-row mb-7 w-full border-2 p-1.5 border-gray-300 ' + (errors.confirmPassword && touched.confirmPassword && dirty ? 'border-red-500' : null)}>
                                        <span className='w-44'>
                                            Street Number
                                </span>
                                        <Field type='password' name='confirmPassword' className={'w-full outline-none '} />
                                    </label>

                                    <label className={'flex flex-row mb-7 w-full border-2 p-1.5 border-gray-300 ' + (errors.confirmPassword && touched.confirmPassword && dirty ? 'border-red-500' : null)}>
                                        <span className='w-44'>
                                            Apartment Number
                                </span>
                                        <Field type='password' name='confirmPassword' className={'w-full outline-none '} />
                                    </label>
                                </div>



                                <button className=' bg-gradient-to-t from-blue-500 
                            to-blue-400 text-white border-blue-600 border-0.5 rounded-md w-32 p-1 
                            self-center hover:bg-gradient-to-t 
                            hover:from-blue-600 hover:to-blue-500' type='submit' onClick={submitForm}>Register</button>

                                <span className='flex flex-row justify-around text-xs mt-8'>
                                    <a href='#' className='text-blue-600 font-bold underline'>Have an account? Login</a>
                                </span>
                            </>
                        )
                    }
                </Formik>
            </div>
        </div>
    );
}

export default Register;