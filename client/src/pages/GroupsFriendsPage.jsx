import React, { useState, useEffect } from 'react';
import Button from '../shared/Button';
import Card from '../shared/Card';
import { getUsersGroup } from '../shared/utils/services/groupsService';

const GroupsFriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    //   get users friend and groups axios
    setFriends(mockFriends);
    setGroups(getUsersGroup(1));
  }, []);

  const blockFriend = (friendId) => {};
  const removeGroup = (groupId) => {};

  return (
    <div className=' grid grid-cols-2'>
      <div>
        <h1 className='text-center text-xl font-bold'>Groups</h1>
        {groups.map((group) => (
          <Card title={group.name} key={group.id}>
            <Button click={() => removeGroup(group.id)}>X</Button>
          </Card>
        ))}
      </div>
      <div>
        <h1 className='text-center text-xl font-bold'>Friends</h1>
        {friends.map((friend) => (
          <Card title={friend.name} key={friend.id}>
            <Button click={() => blockFriend(friend.id)}>Block</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GroupsFriendsPage;

const mockFriends = [
  { name: 'yosi', id: '87d5efa2-46ea-4604-86a6-b390f459ba74' },
  { name: 'rami', id: '665b9601-665c-4151-a1b3-9065ca4f13d0' },
  { name: 'bookie', id: '296c06b4-6101-420f-8f00-03566f867f5e' },
  { name: 'nookie', id: '6e236027-bc8d-453f-88b9-6f6651739abc' },
];
