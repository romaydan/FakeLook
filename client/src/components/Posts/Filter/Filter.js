import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { FaUserAlt, FaUserTag } from 'react-icons/fa';
import { BiCalendar } from 'react-icons/bi';
import { MdLocationOn } from 'react-icons/md';
import { BsTagFill, BsFillPlusCircleFill } from 'react-icons/bs';
import SelectionDropdown from '../../Dropdowns/SelectionDropdown';
import Dropdown from '../../Dropdowns/Dropdown';
import { useState, createRef, useEffect } from "react";

const Filter = props => {
    const { onFilterSubmit, initialFilterValues, friends } = props;
    const [key, setKey] = useState(Math.random());

    return (
        <div className='w-full h-full pr-3 ml-5'>
            <Formik
                initialValues={initialFilterValues}
                onReset={() => setKey(Math.random())}
                onSubmit={(values) => onFilterSubmit(values)}
                enableReinitialize>
                {
                    ({ values, errors, touched, handleReset, resetForm, submitForm }) => (
                        <div key={key + 1}>
                            <label className='flex flex-row w-full items-end my-10' onClick={e => e.preventDefault()}>
                                <FaUserAlt className='h-50px w-50px mr-5 shadow-sm' fill={'white'} />
                                <FieldArray name='publishers'>
                                    {
                                        ({ push, remove }) => (
                                            <SelectionDropdown
                                                items={friends ? [...friends] : []}
                                                placeholder={'Select Freind(s)'}
                                                propertykey={'name'}
                                                onSelected={(item) => {
                                                    push(item.authId)
                                                }}
                                                onDeselected={(item) => {
                                                    const index = values.publishers.indexOf(id => id === item.authId);
                                                    remove(index);
                                                }}
                                                direction={'left'} />
                                        )
                                    }
                                </FieldArray>
                            </label>

                            <div className='flex flex-row w-full items-center justify-start my-16 gap-5 text-white'>
                                <BiCalendar className='h-50px w-50px' fill={'white'} />
                                <label className='flex flex-row items-end'>
                                    {/*  */}
                                    <spna className='text-xl mr-3 font-semibold '>From</spna>
                                    <Field type='date' name='from' className='bg-transparent border-b-2 border-gray-300 
                                border-opacity-50 placeholder-white text-white
                                outline-none focus:placeholder-transparent mr-2  cursor-pointer' />
                                </label>
                                <label className='flex flex-row items-end font-semibold'>
                                    {/* <BiCalendar className='h-50px w-50px mr-5' /> */}
                                    <spna className='text-xl mr-3'>To</spna>
                                    <Field type='date' name='to' className='bg-transparent border-b-2 border-gray-300 
                                border-opacity-50 placeholder-white text-white
                                outline-none focus:placeholder-transparent mr-2 cursor-pointer' />
                                </label>
                            </div>

                            <label className='flex flex-row items-end my-16'>
                                <MdLocationOn className='h-50px w-50px mr-5' fill={'white'} />
                                <Field name='distance' type='number' className='bg-transparent border-b-2 border-gray-300 
                                border-opacity-50 placeholder-white
                                outline-none focus:placeholder-transparent mr-2 text-center text-2xl w-12 text-white'/>
                                <span className='text-xl font-semibold text-white'>KM</span>
                            </label>

                            <label className='flex flex-row items-end my-16' onClick={e => e.preventDefault()}>
                                <BsTagFill className='h-50px w-50px mr-5' fill={'white'} />
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
                                                    direction='left'
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

                            </label>

                            <label className='flex flex-row items-end my-16' onClick={e => e.preventDefault()}>
                                <FaUserTag className='h-50px w-50px mr-5' fill={'white'} />
                                <FieldArray name='userTags'>
                                    {
                                        ({ push, remove }) => (
                                            <SelectionDropdown
                                                items={friends ? [...friends] : []}
                                                propertykey={'name'}
                                                placeholder={'Select Usertag(s)'}
                                                onSelected={(item) => push(item.authId)}
                                                onDeselected={(item) => {
                                                    const index = values.userTags.indexOf(id => id === item.authId);
                                                    remove(index);
                                                }}
                                                direction={'left'} />
                                        )
                                    }
                                </FieldArray>
                            </label>

                            <div className='flex flex-row w-full justify-around -ml-5'>
                                <button className='border-2 border-blue-600 w-1/3 bg-blue-600 h-12 rounded-md text-white font-semibold hover:scale-110 transform transition'
                                    onClick={() => {
                                        submitForm();
                                    }}>
                                    Apply Filter
                                </button>
                                <button onClick={() => {
                                    resetForm({ values: { publishers: [], from: undefined, to: undefined, distance: 10, tags: [], userTags: [] } });
                                }} className='border-2 border-blue-600 w-1/3 bg-blue-600 h-12 rounded-md text-white font-semibold hover:scale-110 transform transition'>
                                    Clear Filter
                                </button>
                            </div>
                        </div>
                    )
                }
            </Formik>
        </div>
    )
}

export default Filter;