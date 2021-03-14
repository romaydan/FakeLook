import React from 'react';

const Card = (props) => {
  const { children } = props;
  return <div className='flex justify-between rounded-sm  shadow-lg p-4 m-2'>{children}</div>;
};

export default Card;
