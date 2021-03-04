import React from 'react';
import { useForm } from 'react-hook-form';
import { addNewGroup } from '../../services/Social/groupsService';

const NewGroup = ({ userId }) => {
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data) => {
    try {
      console.log('data :>> ', data);
      await addNewGroup(userId, data.name);
    } catch (error) {
      console.log('error :>> ', error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Name:
          <input type='text' ref={register} name='name' />
        </label>
        <button type='submit'>Create!</button>
      </form>
    </div>
  );
};

export default NewGroup;
