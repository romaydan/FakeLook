import { Formik, Field, ErrorMessage } from 'formik';
import { useMemo, useState } from 'react';
import * as yup from 'yup';
import Modal from 'react-modal';
import { facebookRegister, fakelookRegister, googleRegister } from '../../../services/Authentication/register.service';
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

const nationList = [
	"Afghanistan",
	"Albania",
	"Algeria",
	"American Samoa",
	"Andorra",
	"Angola",
	"Anguilla",
	"Antarctica",
	"Antigua and Barbuda",
	"Argentina",
	"Armenia",
	"Aruba",
	"Australia",
	"Austria",
	"Azerbaijan",
	"Bahamas",
	"Bahrain",
	"Bangladesh",
	"Barbados",
	"Belarus",
	"Belgium",
	"Belize",
	"Benin",
	"Bermuda",
	"Bhutan",
	"Bolivia",
	"Bonaire, Sint Eustatius and Saba",
	"Bosnia and Herzegovina",
	"Botswana",
	"Bouvet Island",
	"Brazil",
	"British Indian Ocean Territory",
	"Brunei Darussalam",
	"Bulgaria",
	"Burkina Faso",
	"Burundi",
	"Cabo Verde",
	"Cambodia",
	"Cameroon",
	"Canada",
	"Cayman Islands",
	"Central African Republic",
	"Chad",
	"Chile",
	"China",
	"Christmas Island",
	"Cocos Islands",
	"Colombia",
	"Comoros",
	"Congo",
	"Congo",
	"Cook Islands",
	"Costa Rica",
	"Croatia",
	"Cuba",
	"Curaçao",
	"Cyprus",
	"Czechia",
	"Côte d'Ivoire",
	"Denmark",
	"Djibouti",
	"Dominica",
	"Dominican Republic",
	"Ecuador",
	"Egypt",
	"El Salvador",
	"Equatorial Guinea",
	"Eritrea",
	"Estonia",
	"Eswatini",
	"Ethiopia",
	"Falkland Islands",
	"Faroe Islands",
	"Fiji",
	"Finland",
	"France",
	"French Guiana",
	"French Polynesia",
	"French Southern Territories",
	"Gabon",
	"Gambia",
	"Georgia",
	"Germany",
	"Ghana",
	"Gibraltar",
	"Greece",
	"Greenland",
	"Grenada",
	"Guadeloupe",
	"Guam",
	"Guatemala",
	"Guernsey",
	"Guinea",
	"Guinea-Bissau",
	"Guyana",
	"Haiti",
	"Heard Island and McDonald Islands",
	"Holy See",
	"Honduras",
	"Hong Kong",
	"Hungary",
	"Iceland",
	"India",
	"Indonesia",
	"Iran",
	"Iraq",
	"Ireland",
	"Isle of Man",
	"Israel",
	"Italy",
	"Jamaica",
	"Japan",
	"Jersey",
	"Jordan",
	"Kazakhstan",
	"Kenya",
	"Kiribati",
	"The Democratic People's Republic of Korea",
	"The Republic of Korea",
	"Kuwait",
	"Kyrgyzstan",
	"Lao People's Democratic Republic",
	"Latvia",
	"Lebanon",
	"Lesotho",
	"Liberia",
	"Libya",
	"Liechtenstein",
	"Lithuania",
	"Luxembourg",
	"Macao",
	"Madagascar",
	"Malawi",
	"Malaysia",
	"Maldives",
	"Mali",
	"Malta",
	"Marshall Islands",
	"Martinique",
	"Mauritania",
	"Mauritius",
	"Mayotte",
	"Mexico",
	"Micronesia",
	"Moldova",
	"Monaco",
	"Mongolia",
	"Montenegro",
	"Montserrat",
	"Morocco",
	"Mozambique",
	"Myanmar",
	"Namibia",
	"Nauru",
	"Nepal",
	"Netherlands",
	"New Caledonia",
	"New Zealand",
	"Nicaragua",
	"Niger",
	"Nigeria",
	"Niue",
	"Norfolk Island",
	"Northern Mariana Islands",
	"Norway",
	"Oman",
	"Pakistan",
	"Palau",
	"Palestine",
	"Panama",
	"Papua New Guinea",
	"Paraguay",
	"Peru",
	"Philippines",
	"Pitcairn",
	"Poland",
	"Portugal",
	"Puerto Rico",
	"Qatar",
	"Republic of North Macedonia",
	"Romania",
	"Russian Federation",
	"Rwanda",
	"Réunion",
	"Saint Barthélemy",
	"Saint Helena, Ascension and Tristan da Cunha",
	"Saint Kitts and Nevis",
	"Saint Lucia",
	"Saint Martin",
	"Saint Pierre and Miquelon",
	"Saint Vincent and the Grenadines",
	"Samoa",
	"San Marino",
	"Sao Tome and Principe",
	"Saudi Arabia",
	"Senegal",
	"Serbia",
	"Seychelles",
	"Sierra Leone",
	"Singapore",
	"Sint Maarten",
	"Slovakia",
	"Slovenia",
	"Solomon Islands",
	"Somalia",
	"South Africa",
	"South Georgia and the South Sandwich Islands",
	"South Sudan",
	"Spain",
	"Sri Lanka",
	"Sudan",
	"Suriname",
	"Svalbard and Jan Mayen",
	"Sweden",
	"Switzerland",
	"Syrian Arab Republic",
	"Taiwan",
	"Tajikistan",
	"Tanzania, United Republic of",
	"Thailand",
	"Timor-Leste",
	"Togo",
	"Tokelau",
	"Tonga",
	"Trinidad and Tobago",
	"Tunisia",
	"Turkey",
	"Turkmenistan",
	"Turks and Caicos Islands",
	"Tuvalu",
	"Uganda",
	"Ukraine",
	"United Arab Emirates",
	"United Kingdom of Great Britain and Northern Ireland",
	"United States Minor Outlying Islands",
	"United States of America",
	"Uruguay",
	"Uzbekistan",
	"Vanuatu",
	"Venezuela",
	"Viet Nam",
	"Virgin Islands (British)",
	"Virgin Islands (U.S)",
	"Wallis and Futuna",
	"Western Sahara",
	"Yemen",
	"Zambia",
	"Zimbabwe",
	"Åland Islands"
    ];

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
        birthDate: yup.date().typeError('Invalid date').required('birth date is required'),
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
         border-gray-300 bg-center w-1/4 p-5 
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

                                <EmailAndPassword errors={errors} isOAuth={isOAuth} dirty={dirty} touched={touched} />

                                <UserDetails errors={errors} dirty={dirty} isOAuth={isOAuth} touched={touched} />

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
    const { errors, isOAuth, dirty, touched } = props;

    return (
        <fieldset className={isOAuth.state ? ' opacity-50' : ''} disabled={isOAuth.state}>
            <label className={'flex flex-row w-full border-2 p-1.5 border-gray-300 ' + (errors.email && touched.email && !isOAuth.state ? 'border-red-500' : null)}>
                <span className='w-48'>
                    Email
                </span>
                <Field type='email' name='email' className={'w-full outline-none '} />
            </label>
            <ErrorMessage name='email' render={msg => <div className='text-red-500 absolute'>{msg}</div>} />

            <label className={'flex flex-row mt-7 w-full border-2 p-1.5 border-gray-300 ' + (errors.password && touched.password && !isOAuth.state ? 'border-red-500' : null)}>
                <span className='w-48'>
                    Password
                </span>
                <Field type='password' name='password' className={'w-full outline-none '} />
            </label>
            <ErrorMessage name='password' render={msg => <div className='text-red-500 absolute'>{msg}</div>} />

            <label className={'flex flex-row mt-7 w-full border-2 p-1.5 border-gray-300 ' + (errors.confirmPassword && touched.confirmPassword && !isOAuth.state ? 'border-red-500' : null)}>
                <span className='w-48'>
                    Confirm Password
                </span>
                <Field type='password' name='confirmPassword' className={'w-full outline-none '} />
            </label>
            <ErrorMessage name='confirmPassword' render={msg => <div className='text-red-500 absolute'>{msg}</div>} />

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
    const { errors, dirty, isOAuth, touched } = props;

    return (
        <div className=' mt-7 grid grid-cols-2 gap-1'>
            <div>
                <label className={'flex flex-row w-full border-2 p-1.5 border-gray-300 ' + (isOAuth.state ? ' opacity-50 ' : ' ') + (errors.name && touched.name ? 'border-red-500' : null)}>
                    <span className='w-36'>
                        Name
                    </span>
                    <Field name='name' className={'w-full outline-none '} disabled={isOAuth.state} />
                </label>
                <ErrorMessage name='name' render={msg => <div className='text-red-500 absolute'>{msg}</div>} />
            </div>

            <div>
                <label className={'flex flex-row w-full border-2 p-1.5 border-gray-300 ' + (errors.birthDate && touched.birthDate ? 'border-red-500' : null)}>
                    <span className='w-36'>
                        BirthDate
                </span>
                    <Field type='date' name='birthDate' className={'w-full outline-none '} />
                </label>
                <ErrorMessage name='birthDate' render={msg => <div className='text-red-500 absolute'>{msg}</div>} />
            </div>

            <div className='mt-7'>
                <label className={'flex flex-row w-full border-2 p-1.5 border-gray-300 ' + (errors.street && touched.street ? 'border-red-500' : null)}>
                    <span className='w-36'>
                        Street
                    </span>
                    <Field name='street' className={'w-full outline-none '} />
                </label>
                <ErrorMessage name='street' render={msg => <div className='text-red-500 absolute'>{msg}</div>} />
            </div>

            <div className='mt-7'>
                <label className={'flex flex-row w-full border-2 p-1.5 border-gray-300 ' + (errors.city && touched.city ? 'border-red-500' : null)}>
                    <span className='w-36'>
                        City
                    </span>
                    <Field name='city' className={'w-full outline-none '} />
                </label>
                <ErrorMessage name='city' render={msg => <div className='text-red-500 absolute'>{msg}</div>} />
            </div>

            <div className='mt-7'>
                <label className={'flex flex-row w-full border-2 p-1.5 border-gray-300 ' + (errors.country && touched.country ? 'border-red-500' : null)}>
                    <span className='w-36'>
                        Country
                    </span>
                    <Field as='select' name='country' className={'w-full outline-none '}>
                        <option value='' disabled selected>Select a country...</option>
                        {
                            nationList.map((nation, i) => <option key={i} value={nation}>{nation}</option>)
                        }
                    </Field>
                </label>
                <ErrorMessage name='country' render={msg => <div className='text-red-500 absolute'>{msg}</div>} />
            </div>

            <div className='mt-7'>
                <label className={'flex flex-row w-full border-2 p-1.5 border-gray-300 ' + (errors.houseNo && touched.houseNo ? 'border-red-500' : null)}>
                    <span className='w-36'>
                        St. Number
                    </span>
                    <Field name='houseNo' className={'w-full outline-none '} />
                </label>
                <ErrorMessage name='houseNo' render={msg => <div className='text-red-500 absolute'>{msg}</div>} />
            </div>
            <div className='mt-7'>

                <label className={'flex flex-row w-full border-2 p-1.5 border-gray-300 ' + (errors.aptNo && touched.aptNo ? 'border-red-500' : null)}>
                    <span className='w-36'>
                        Apt. Number
                    </span>
                    <Field name='aptNo' className={'w-full outline-none '} />
                </label>
                <ErrorMessage name='aptNo' render={msg => <div className='text-red-500 absolute'>{msg}</div>} />
            </div>
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
            <button className={BUTTON_STYLE + ' mt-7 ' + (isOAuth.state ? 'hidden' : '')} type='submit'
                onClick={() => {
                    validateForm(values)
                        .then((err) => {
                            Object.keys(err).length > 0 ? setIsOpen(true) : submitForm()
                        })
                }}>Register</button>

            <span className={(isOAuth.state && isOAuth.type === OAuthType.GOOGLE) ? '' : 'hidden'}>
                <GoogleLogin className={'rounded-md mt-7'}
                    disabled={Object.keys(errors).some(err => errors[err] && err != 'response')}
                    clientId={'332337525586-rpk6kqpc36ja5st3dsc40g8593e5kjkj.apps.googleusercontent.com'}
                    buttonText={'Regiter with Google'}
                    onSuccess={onGoogleSuccessResponse} />
            </span>
            <span className={(isOAuth.state && isOAuth.type === OAuthType.FACEBOOK) ? '' : 'hidden'}>
                <FacebookLogin
                    isDisabled={Object.keys(errors).some(err => errors[err] && err != 'response')}
                    cssClass={'w-44 p-1.5 bg-blue-500 text-white text-sm rounded-md self-center shadow-md h-10 self-center mt-7'}
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