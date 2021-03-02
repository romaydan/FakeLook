import React from 'react';
import { useForm } from 'react-hook-form';

const NewGroup = () => {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    console.log();
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
