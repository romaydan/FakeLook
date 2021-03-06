import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../shared/components/utils/items';

const DropBox = (props) => {
  const { children, onDrop } = props;
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item, monitor) => {
      onDrop(item);
    },
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  });
  return (
    <div className='min-h-full bg-gray-50' ref={drop}>
      {children}
    </div>
  );
};

export default DropBox;
