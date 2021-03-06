import React from 'react';
import { useDrag } from 'react-dnd';

import { ItemTypes } from './utils/items';

const DragCard = (props) => {
  const { children } = props;
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.CARD, item: props.id },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  });
  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? '0.5' : '1' }}
      className='flex justify-between border-1 rounded bg-green-100 border-gray-900 shadow p-4 m-1'
    >
      {children}
    </div>
  );
};

export default DragCard;
