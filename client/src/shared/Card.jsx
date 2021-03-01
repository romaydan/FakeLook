import React from 'react';

import PropTypes from 'prop-types';

const Card = (props) => {
  const { children, title } = props;
  return (
    <div class='flex justify-between border-1 rounded  border-black shadow p-3 m-2'>
      <h2 className='text-gray-800 capitalize text-xl font-bold'>{title}</h2>
      <div>{children}</div>
    </div>
  );
};

Card.propTypes = {};

export default Card;
