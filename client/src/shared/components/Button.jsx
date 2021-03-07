import React from 'react';

const Button = (props) => {
  const { children, click, color, type } = props;
  return (
    <button type={type} onClick={click} className={`rounded border-1 p-2 bg-${color ? color : 'bg-gray-200'} border-gray-400 shadow `}>
      {children}
    </button>
  );
};

Button.propTypes = {};

export default Button;
