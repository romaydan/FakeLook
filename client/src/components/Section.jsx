import React from 'react';
import Button from '../shared/components/Button';
import Card from '../shared/components/Card';

const Section = (props) => {
  const { title, list, itemBtnClick, createBtnClick } = props;
  return (
    <div className='p-3'>
      <div className='flex justify-between'>
        <h1 className='text-center text-xl capitalize font-bold'>{title}</h1>
        <Button className='capitalize' click={createBtnClick}>
          New {title}
        </Button>
      </div>
      {list.map((friend) => (
        <Card title={friend.name} key={friend.id}>
          <Button click={() => itemBtnClick(friend.id)}>Block</Button>
        </Card>
      ))}
    </div>
  );
};

export default Section;
