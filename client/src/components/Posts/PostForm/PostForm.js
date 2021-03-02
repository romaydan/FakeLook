import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { createRef, useMemo, useRef, useState } from "react";
import * as yup from 'yup';
import SelectionDropdown from "../Dropdowns/SelectionDropdown";
import Modal from 'react-modal';
import Dropdown from '../Dropdowns/Dropdown';
import { BsFillPlusCircleFill } from 'react-icons/bs';

const BUTTON_CLASS = `bg-gradient-to-t from-blue-500 
to-blue-400 text-white border-blue-600 border-0.5 rounded-md 
hover:bg-gradient-to-t 
hover:from-blue-600 hover:to-blue-500 text-center flex 
justify-center items-center text-xl font-semibold cursor-pointer place-self-center`

const PostForm = props => {
    const { friends } = props;

    const [wordCount, setWordCount] = useState(140);
    const VALID_FILE_TYPES = useMemo(() => ['image/jpeg', 'image/png', 'image/jpg'], []);

    const validationSchema = useMemo(() => yup.object({
        image: yup.mixed().required().test('type', 'not an image',
            value => VALID_FILE_TYPES.includes(value?.type)),
        textContent: yup.string().max(140, 'too long')
    }), [])

    return (
        <Formik
            validationSchema={validationSchema}
            onSubmit={(values) => {
                console.log('submit', values);
            }}
            initialValues={{ image: undefined, textContent: '', userTags: [], tags: [] }}>
            {
                ({ values, errors, touched, submitForm, setFieldValue }) => (
                    <div className='flex flex-col h-full w-5/6'>

                        <div className='grid grid-cols-4 items-center justify-evenly max-h-fit w-full
                        border-b-4 border-gray-200 pb-10'>

                            <label className='bg-gradient-to-t from-blue-500 
                            to-blue-400 text-white border-blue-600 border-0.5 rounded-md 
                            hover:bg-gradient-to-t 
                            hover:from-blue-600 hover:to-blue-500 h-12 w-full text-center flex 
                            justify-center items-center text-xl font-semibold cursor-pointer place-self-center'>
                                <input className='hidden' type='file' name='image' accept='image/*' onChange={(e) => setFieldValue('image', e.target.files[0])} />
                                {values.image?.name ?? 'Select Image'}
                            </label>

                            <span className={'container border-4 border-gray-200 p-2 col-span-3 h-96 ml-5'}>
                                <img className=' max-h-full max-w-full mr-auto ml-auto' src={values.image ? URL.createObjectURL(values.image) : null} />
                            </span>
                        </div>

                        <div className='w-full flex flex-row items-center justify-between border-b-4 border-gray-200 p-5'>
                            <span className='h-full flex flex-row items-center'>
                                <span className='text-center mr-2'>User-tags:</span>
                                <FieldArray name='userTags'>
                                    {
                                        ({push, remove}) => (
                                            <SelectionDropdown items={friends}
                                                propertykey={'name'}
                                                placeholder={'Select Friend(s)'}
                                                onSelected={(item) => {
                                                    push(item.id)
                                                }}
                                                onDeselected={(item) => {
                                                    const index = values.userTags?.findIndex(id => id === item.id);

                                                    if(index >= 0) {
                                                        remove(index);
                                                    }
                                                }} />
                                        )
                                    }
                                </FieldArray>
                            </span>

                            <span className='h-full flex flex-row items-center'>
                                <span className='mr-2'>Tags: </span>
                                <FieldArray name='tags'>
                                    {
                                        ({ push, remove }) => {

                                            const inputRef = createRef();
                                            const addTag = (tag) => {
                                                if (!values.tags?.includes(tag) && inputRef.current.value) {
                                                    push(tag);
                                                    inputRef.current.value = '';
                                                }
                                            }
                                            const removeTag = (i) => {
                                                remove(i);
                                            }

                                            return (
                                                <Dropdown
                                                    items={values.tags}
                                                    direction='right'
                                                    title={values.tags.length > 0 ? `${values.tags?.length} Tag(s)` : 'Add...'}
                                                    render={(items) => (
                                                        <div className='h-full pl-2'>
                                                            <div className='my-2 flex flex-col overflow-y-scroll max-h-52 scrollbar-a scrollbar-curve'>
                                                                {
                                                                    items.map((item, i) => <span className='mb-1 mr-2 cursor-pointer hover:bg-gray-100 
                                                                        hover:scale-105 transform transition-transform rounded-md'
                                                                        onClick={() => removeTag(i)}>{'#' + item}</span>)
                                                                }
                                                            </div>
                                                            <span className='flex flex-row items-center mr-2'>
                                                                <input className='h-5 w-full mr-1 pl-1 border-2 border-gray-200 rounded-md' ref={inputRef} />
                                                                <BsFillPlusCircleFill className=' cursor-pointer fill-like-blue h-5 w-5 hover:scale-125 transform transition'
                                                                    onClick={() => addTag(inputRef.current.value)} />
                                                            </span>
                                                        </div>
                                                    )
                                                    } />
                                            )
                                        }
                                    }
                                </FieldArray>

                            </span>
                        </div>

                        <div className='mt-10'>
                            <Field as='textarea'
                                name='textContent'
                                className='w-full max-h-fit outline-none border-2 rounded-lg text-2xl pl-2 overflow-x-hidden 
                                overflow-y-auto border-gray-200 scrollbar-a resize-none'
                                placeholder='Describe...'
                                onChange={(e) => {
                                    const len = e.target.value.length;
                                    if (wordCount > 0 || values.textContent.length > len) {
                                        setFieldValue('textContent', e.target.value);
                                        setWordCount(140 - len);
                                    }
                                }} />
                            <small className='text-md font-semibold'>{wordCount + ' characters left...'}</small>
                            <ErrorMessage name='textContent' />
                        </div>

                        <button type='submit'
                            className='bg-gradient-to-t from-blue-500 
                            to-blue-400 text-white border-blue-600 border-0.5 rounded-md 
                            hover:bg-gradient-to-t 
                            w-52 m-10
                            self-center
                            hover:from-blue-600 hover:to-blue-500 h-12 text-center
                            justify-center' onClick={submitForm}>{'Submit'}</button>
                    </div>
                )
            }
        </Formik>
    )
}

export default PostForm;