import { Formik, Field } from 'formik';
import { useMemo, useState } from 'react';
import * as yup from 'yup';
import Modal from 'react-modal';
import { facebookRegister, fakelookRegister, googleRegister } from '../../../services/Authentication/login.service';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

const BUTTON_STYLE = `bg-gradient-to-t from-blue-500 
to-blue-400 text-white border-blue-600 border-0.5 rounded-md w-32 p-1 
self-center hover:bg-gradient-to-t 
hover:from-blue-600 hover:to-blue-500 `;

const OAuthType = {
    GOOGLE: 'GOOGLE',
    FACEBOOK: 'FACEBOOK',
    NONE: 'NONE'
}

const Register = props => {
    const { history } = props;

    const [isOpen, setIsOpen] = useState(false);
    const [isOAuth, setIsOAuth] = useState({ state: false, type: OAuthType.NONE });

    const validationSchema = useMemo(() => yup.object({
        email: yup.lazy(() => {
            if (isOAuth.state)
                return yup.mixed().notRequired();

            return yup.string().required().email()
        }),
        password: yup.lazy(() => {
            if (isOAuth.state)
                return yup.mixed().notRequired();

            return yup.string().required().min(8).max(16)
        }),
        confirmPassword: yup.lazy(() => {
            if (isOAuth.state)
                return yup.mixed().notRequired();

            return yup.string().required().oneOf([yup.ref('password'), null], 'passwords do not match');
        }),
        name: yup.lazy(() => {
            if (isOAuth.state)
                return yup.string().notRequired();

            return yup.string().required()
        }),
        birthDate: yup.date().required('birth date is required'),
        street: yup.string().required(),
        city: yup.string().required(),
        country: yup.string().required(),
        houseNo: yup.string().required(),
        aptNo: yup.string()
    }), [isOAuth]);

    const registerWithFakelook = (email, password, confirmPassword, user, address) => {
        console.log('fakelook')
        fakelookRegister(email, password, confirmPassword, user, address)
            .then(res => {
                console.log(res);
                history.push('/login');
            })
            .catch(err => console.error('error', err))
    }

    const registerWithFacebook = (response, user, address) => {
        const { id: facebookId, accessToken } = response;
        facebookRegister(accessToken, facebookId, user, address)
            .then(res => {
                console.log(res);
                history.push('/login');
            })
            .catch(console.error);
    }

    const registerWithGoogle = (response, user, address) => {
        const { tokenId } = response;
        googleRegister(tokenId, user, address)
            .then(res => {
                console.log(res);
                history.push('/login');
            })
            .catch(console.error);
    }

    const onFormSubmit = ({ email, password, confirmPassword, name, birthDate, street, city, country, houseNo, aptNo, response }) => {
        const user = { name, birthDate };
        const address = { street, city, country, houseNo, aptNo };

        console.log(user);

        if (!isOAuth.state)
            return registerWithFakelook(email, password, confirmPassword, user, address);

        if (isOAuth.type === OAuthType.FACEBOOK)
            return registerWithFacebook(response, user, address);

        if (isOAuth.type === OAuthType.GOOGLE)
            return registerWithGoogle(response, user, address);

    }

    return (
        <div className='flex flex-row justify-center h-screen'>
            <div className='flex flex-col object-center border-2
         border-gray-300 bg-center w-1/3 p-5 
         self-center rounded-md shadow-xl'>
                <h1 className='self-center text-5xl font-extrabold mb-10 antialiased text-blue-400 text-'>Welcome to FakeLook</h1>
                <Formik
                    validationSchema={validationSchema}
                    initialValues={{ password: '', confirmPassword: '', email: '', name: '', birthDate: null, street: '', city: '', country: '', houseNo: '', aptNo: '', response: null }}
                    onSubmit={onFormSubmit}>
                    {
                        ({ values, errors, touched, submitForm, dirty, validateForm, setFieldValue }) => (
                            <>
                                <ServiceSelection setFieldValue={setFieldValue} setIsOAuth={setIsOAuth} isOAuth={isOAuth} />

                                <EmailAndPassword errors={errors} isOAuth={isOAuth} dirty={dirty} />

                                <UserDetails errors={errors} dirty={dirty} isOAuth={isOAuth} />

                                <SubmitButtons validateForm={validateForm} submitForm={submitForm}
                                    setIsOpen={setIsOpen} setFieldValue={setFieldValue}
                                    isOAuth={isOAuth} errors={errors} values={values} />

                                <ErrorsModal isOpen={isOpen} setIsOpen={setIsOpen} errors={errors} />
                            </>
                        )
                    }
                </Formik>
            </div>
        </div>
    );
}

const EmailAndPassword = props => {
    const { errors, isOAuth, dirty } = props;

    return (
        <fieldset className={isOAuth.state ? ' opacity-50' : ''} disabled={isOAuth.state}>
            <label className={'flex flex-row mb-7 w-full border-2 p-1.5 border-gray-300 ' + (errors.email && dirty && !isOAuth.state ? 'border-red-500' : null)}>
                <span className='w-44'>
                    Email
                </span>
                <Field type='email' name='email' className={'w-full outline-none '} />
            </label>
            <label className={'flex flex-row mb-7 w-full border-2 p-1.5 border-gray-300 ' + (errors.password && dirty && !isOAuth.state ? 'border-red-500' : null)}>
                <span className='w-44'>
                    Password
                </span>
                <Field type='password' name='password' className={'w-full outline-none '} />
            </label>
            <label className={'flex flex-row mb-7 w-full border-2 p-1.5 border-gray-300 ' + (errors.confirmPassword && dirty && !isOAuth.state ? 'border-red-500' : null)}>
                <span className='w-44'>
                    Confirm Password
                </span>
                <Field type='password' name='confirmPassword' className={'w-full outline-none '} />
            </label>
        </fieldset>
    )
}

const ServiceSelection = props => {

    const { setIsOAuth, setFieldValue, isOAuth } = props

    return (
        <div className='flex flex-row'>
            <label className='mr-3' for='fakelook-radio'>
                <input className='mr-1' id='fakelook-radio' type='radio' name='group' checked={!isOAuth.state}
                    onClick={(e) => {
                        setIsOAuth({ state: false, type: OAuthType.NONE })
                    }} />
                FakeLook
        </label>
            <label className='mr-3' for='facebook-radio'>
                <input className='mr-1' id='facebook-radio' type='radio' name='group'
                    onClick={(e) => {
                        setFieldValue('response', null)
                        setIsOAuth({ state: true, type: OAuthType.FACEBOOK })
                    }} />
            Facebook
        </label>
            <label for='google-radio'>
                <input className='mr-1' id='google-radio' type='radio' name='group'
                    onClick={(e) => {
                        setFieldValue('response', null)
                        setIsOAuth({ state: true, type: OAuthType.GOOGLE })
                    }} />
            Google
        </label>
        </div>
    )
}

const UserDetails = props => {
    const { errors, dirty, isOAuth } = props;

    return (
        <div className='grid grid-cols-2 gap-1'>
            <label className={'flex flex-row mb-7 w-full border-2 p-1.5 border-gray-300 ' + (isOAuth.state ? ' opacity-50 ' : ' ') + (errors.name && dirty ? 'border-red-500' : null)}>
                <span className='w-36'>
                    Name
            </span>
                <Field name='name' className={'w-full outline-none '} disabled={isOAuth.state} />
            </label>

            <label className={'flex flex-row mb-7 w-full border-2 p-1.5 border-gray-300 ' + (errors.birthDate && dirty ? 'border-red-500' : null)}>
                <span className='w-36'>
                    BirthDate
            </span>
                <Field type='date' name='birthDate' className={'w-full outline-none '} />
            </label>

            <label className={'flex flex-row mb-7 w-full border-2 p-1.5 border-gray-300 ' + (errors.street && dirty ? 'border-red-500' : null)}>
                <span className='w-36'>
                    Street
            </span>
                <Field name='street' className={'w-full outline-none '} />
            </label>

            <label className={'flex flex-row mb-7 w-full border-2 p-1.5 border-gray-300 ' + (errors.city && dirty ? 'border-red-500' : null)}>
                <span className='w-36'>
                    City
            </span>
                <Field name='city' className={'w-full outline-none '} />
            </label>

            <label className={'flex flex-row mb-7 w-full border-2 p-1.5 border-gray-300 ' + (errors.country && dirty ? 'border-red-500' : null)}>
                <span className='w-36'>
                    Country
            </span>
                <Field name='country' className={'w-full outline-none '} />
            </label>

            <label className={'flex flex-row mb-7 w-full border-2 p-1.5 border-gray-300 ' + (errors.houseNo && dirty ? 'border-red-500' : null)}>
                <span className='w-36'>
                    St. Number
            </span>
                <Field name='houseNo' className={'w-full outline-none '} />
            </label>

            <label className={'flex flex-row mb-7 w-full border-2 p-1.5 border-gray-300 ' + (errors.aptNo && dirty ? 'border-red-500' : null)}>
                <span className='w-36'>
                    Apt. Number
            </span>
                <Field name='aptNo' className={'w-full outline-none '} />
            </label>
        </div>
    )
}

const SubmitButtons = props => {
    const { validateForm, setIsOpen, submitForm, setFieldValue, isOAuth, errors, values } = props;

    const onGoogleSuccessResponse = (response) => {
        const { profileObj: { name } } = response;
        setFieldValue('response', response);
        setFieldValue('name', name);

        validateForm(values)
            .then(err => {
                Object.keys(err).length > 0 ? setIsOpen(true) : submitForm()
            })
    }

    const onFacebookSuccessResponse = (response) => {
        const { name } = response;
        setFieldValue('response', response)
        setFieldValue('name', name);

        validateForm(values)
            .then(err => {
                Object.keys(err).length > 0 ? setIsOpen(true) : submitForm()
            })
    }

    return (
        <div className='self-center'>
            <button className={BUTTON_STYLE + (isOAuth.state ? 'hidden' : '')} type='submit'
                onClick={() => {
                    validateForm(values)
                        .then((err) => {
                            Object.keys(err).length > 0 ? setIsOpen(true) : submitForm()
                        })
                }}>Register</button>

            <span className={(isOAuth.state && isOAuth.type === OAuthType.GOOGLE) ? '' : 'hidden'}>
                <GoogleLogin className={'rounded-md '}
                    disabled={Object.keys(errors).some(err => errors[err] && err != 'response')}
                    clientId={'332337525586-rpk6kqpc36ja5st3dsc40g8593e5kjkj.apps.googleusercontent.com'}
                    buttonText={'Regiter with Google'}
                    onSuccess={onGoogleSuccessResponse} />
            </span>
            <span className={(isOAuth.state && isOAuth.type === OAuthType.FACEBOOK) ? '' : 'hidden'}>
                <FacebookLogin
                    isDisabled={Object.keys(errors).some(err => errors[err] && err != 'response')}
                    cssClass={'w-44 p-1.5 bg-facebook text-white text-sm rounded-md self-center shadow-md h-10 self-center '}
                    appId={'453933415731261'}
                    textButton={'Register with Facebook'}
                    autoLoad={false}
                    fields={'name,email,picture'}
                    callback={onFacebookSuccessResponse} />
            </span>
        </div>
    )
}

const ErrorsModal = props => {
    const { isOpen, setIsOpen, errors } = props;

    return (
        <Modal
            isOpen={isOpen}
            //onRequestClose={() => setIsOpen(false)}
            className='absolute h-1/2 w-1/2 right-1/4 left-1/4 top-1/4 bg-white shadow-lg 
        flex flex-col items-center p-5'>
            <>
                <span className='text-4xl mb-5 font-bold'>We're missing some information...</span>
                <ul className='list-decimal'>
                    {
                        Object.keys(errors).map((err, i) => {
                            return <li key={i}>{errors[err]}</li>
                        })
                    }
                </ul>
                <button className={'absolute bottom-0 mb-5 ' + BUTTON_STYLE}
                    onClick={() => setIsOpen(false)}>Close</button>
            </>
        </Modal>
    )
}

export default Register;