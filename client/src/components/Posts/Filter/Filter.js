import { Field, FieldArray, Formik } from "formik";
import { FaUserAlt, FaUserTag } from 'react-icons/fa';
import { BiCalendar, BiCheck } from 'react-icons/bi';
import { MdLocationOn } from 'react-icons/md';
import { BsTagFill, BsFillPlusCircleFill } from 'react-icons/bs';
import SelectionDropdown from '../../Dropdowns/SelectionDropdown';
import ItemsDropdown from '../../Dropdowns/ItemsDropdown';
import Dropdown from '../../Dropdowns/Dropdown';
import { useState, createRef, useMemo } from "react";
import * as yup from 'yup';

const Filter = props => {
    const { onFilterSubmit, initialFilterValues, friends, groups } = props;
    const [key, setKey] = useState(Math.random());

    const validationSchema = useMemo(() => yup.object({
        distance: yup.number().min(1).max(50)
    }), []);

    return (
        <div className='w-full h-full pr-3 ml-5'>
            <Formik
                initialValues={initialFilterValues}
                onReset={() => setKey(Math.random())}
                validationSchema={validationSchema}
                onSubmit={(values) => onFilterSubmit(values)}
                enableReinitialize>
                {
                    ({ values, errors, touched, handleReset, resetForm, submitForm, setFieldValue }) => (
                        <div key={key + 1}>
                            <label className='flex flex-row w-full items-end my-10' onClick={e => e.preventDefault()}>
                                <FaUserAlt className='h-50px w-50px mr-5 shadow-sm' fill={'white'} />
                                <FieldArray name='publishers'>
                                    {
                                        ({ push, remove }) => (
                                            <Dropdown title={'Select Friends'} direction={'left'}>
                                                <div>
                                                    <div className='mx-2 mb-2'>
                                                        <label className='font-semibold'>Friends</label>
                                                        <ul className='overflow-y-auto scrollbar-a'>
                                                            {
                                                                friends?.map((friend, i) => <li key={i + '_friends'} className='hover:bg-gray-100 cursor-pointer flex flex-row items-center'
                                                                    onClick={() => {
                                                                        const index = values.publishers.findIndex(id => id === friend.authId)
                                                                        index >= 0 ? remove(index) : push(friend.authId);
                                                                    }}>
                                                                    {friend.name}
                                                                    {values.publishers.findIndex(id => id === friend.authId) >= 0 && <BiCheck className='fill-check-green w-25px h-25px' />}
                                                                </li>)
                                                            }
                                                        </ul>
                                                    </div>

                                                    <hr />

                                                    <div className='mx-2 mt-2'>
                                                        <label className='font-semibold'>Groups</label>
                                                        <ul className='overflow-y-auto scrollbar-a'>
                                                            {
                                                                groups?.map((group, i) => {
                                                                    const isGroupSelected = group.friends.every(friendId => values.publishers.includes(friendId));
                                                                    return (
                                                                        <li key={i + '_groups'} className='hover:bg-gray-100 cursor-pointer flex flex-row items-center'
                                                                            onClick={() => {
                                                                                isGroupSelected ? group.friends.forEach(friendId => {
                                                                                    const index = values.publishers.findIndex(id => id === friendId)
                                                                                    remove(index);
                                                                                }) : group.friends.forEach(friendId => push(friendId))
                                                                            }}>
                                                                            {group.name}
                                                                            {isGroupSelected && <BiCheck className='fill-check-green w-25px h-25px' />}
                                                                        </li>
                                                                    )
                                                                })
                                                            }
                                                        </ul>
                                                    </div>
                                                </div>
                                            </Dropdown>
                                        )
                                    }
                                </FieldArray>
                            </label>

                            <div className='flex flex-row w-full items-center justify-start my-16 gap-5 text-white'>
                                <BiCalendar className='h-50px w-50px fill-white' />
                                <label className='flex flex-row items-end'>
                                    {/*  */}
                                    <spna className='text-xl mr-3 font-semibold '>From</spna>
                                    <Field type='date' name='from' className='bg-transparent border-b-2 border-gray-300 
                                border-opacity-50 placeholder-white text-white
                                outline-none focus:placeholder-transparent mr-2  cursor-pointer' />
                                </label>
                                <label className='flex flex-row items-end font-semibold'>
                                    <spna className='text-xl mr-3'>To</spna>
                                    <Field type='date' name='to' className='bg-transparent border-b-2 border-gray-300 
                                border-opacity-50 placeholder-white text-white
                                outline-none focus:placeholder-transparent mr-2 cursor-pointer' />
                                </label>
                            </div>

                            <label className='flex flex-row items-end my-16'>
                                <MdLocationOn className='h-50px w-50px mr-5' fill={'white'} />
                                <Field name='distance' type='number' min={1} max={50} className='bg-transparent border-b-2 border-gray-300 
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
                                                <ItemsDropdown
                                                    items={values.tags}
                                                    direction='left'
                                                    title={values.tags.length > 0 ? `${values.tags?.length} Tag(s)` : 'Add...'}
                                                    render={(items) => (
                                                        <div className='h-full pl-2'>
                                                            <div className='my-2 flex flex-col overflow-y-scroll max-h-52 scrollbar-a scrollbar-curve'>
                                                                {
                                                                    items.map((item, i) => <span key={i + '_tags'} className='mb-1 mr-2 cursor-pointer hover:bg-gray-100 
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
                                                onSelected={(friend) => push(friend.authId)}
                                                onDeselected={(friend) => {
                                                    const index = values.userTags.indexOf(id => id === friend.authId);
                                                    remove(index);
                                                }}
                                                direction={'left'} />
                                        )
                                    }
                                </FieldArray>
                            </label>

                            <div className='flex flex-row w-full justify-around -ml-5'>
                                <button className='border-2 border-blue-600 w-1/3 bg-blue-600 h-12 rounded-md text-white font-semibold hover:scale-110 transform transition'
                                    onClick={submitForm}>
                                    Apply Filter
                                </button>
                                <button onClick={() => resetForm({ values: { publishers: [], from: undefined, to: undefined, distance: 10, tags: [], userTags: [] } })}
                                    className='border-2 border-blue-600 w-1/3 bg-blue-600 h-12 rounded-md text-white font-semibold hover:scale-110 transform transition'>
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