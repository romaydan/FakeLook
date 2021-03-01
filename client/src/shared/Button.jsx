import React from 'react';
import PropTypes from 'prop-types';

const Button = (props) => {
  const { children, label, click } = props;
  return (
    <div>
      <button onClick={click} className='rounded border-1 p-2 border-gray-400 shadow bg-indigo-50-50 '>
        {children}
      </button>
    </div>
  );
};

Button.propTypes = {};

export default Button;
