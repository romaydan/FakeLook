import React from 'react';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';

const Section = (props) => {
  const { title, list, firstBtnClick, secondBtnClick, createBtnClick } = props;
  return (
    <div className='p-3'>
      <div className='flex justify-evenly'>
        <h1 className='text-center text-4xl capitalize font-bold'>{title}</h1>
        <Button className='capitalize ' click={createBtnClick}>
          Add {title}
        </Button>
      </div>
      {list.length > 0
        ? list.map((friend) => (
            <Card title={friend.name} key={friend.id}>
              <h2 className='text-gray-800 capitalize text-xl font-bold self-center '>{friend.name}</h2>
              <div>
                <Button color='blue-400' click={() => firstBtnClick(friend.id)}>
                  Block
                </Button>
                <Button color='red-300' click={() => secondBtnClick(friend.id)}>
                  Remove
                </Button>
              </div>
            </Card>
          ))
        : null}
    </div>
  );
};

export default Section;
