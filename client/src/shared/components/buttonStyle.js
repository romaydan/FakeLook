const buttonStyle = (color = 'blue', addedAttributes = '') => {
  return `bg-gradient-to-t from-${color}-500 
to-${color}-400 text-white border-${color}-600 border-0.5 rounded-md w-32 p-1 
self-center hover:bg-gradient-to-t 
hover:from-${color}-600 hover:to-${color}-500 disabled:opacity-50

${addedAttributes}`;
};
export default buttonStyle