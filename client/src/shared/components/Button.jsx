import React from 'react';

const Button = (props) => {
  const { children, click, color } = props;
  return (
    <div>
      <button onClick={click} className={`rounded m-4 border-1 p-2 bg-${color ? color : 'bg-gray-200'} border-gray-400 shadow `}>
        {children}
      </button>
    </div>
  );
};

Button.propTypes = {};

export default Button;
