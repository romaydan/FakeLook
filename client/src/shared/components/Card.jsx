import React from 'react';

import PropTypes from 'prop-types';

const Card = (props) => {
  const { children } = props;
  return <div className='flex justify-between border-1 rounded bg-green-100 border-gray-900 shadow p-4 m-1'>{children}</div>;
};

export default Card;
