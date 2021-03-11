import React, { useState, useEffect } from 'react';
import { getUsersByName, sendFriendRequest } from '../../services/Friends/friends.service';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';

const AddFriend = (props) => {
  const { userId } = props;
  const [friendName, setFriendName] = useState('');
  const [users, setUsers] = useState([]);

  const searchFriend = async (e) => {
    setFriendName(e.target.value);
    const result = await getUsersByName(userId, e.target.value);
    setUsers(result);
  };

  useEffect(() => {
    console.log('users :>> ', users);
  }, [users]);

  const sendFriendRequestHandler = async (friendId) => {
    const res = await sendFriendRequest(userId, friendId);
    console.log('res :>> ', res);
  };

  return (
    <div>
      <label>
        name:
        <input type='text' onChange={searchFriend} value={friendName} />
        {users &&
          users.map((u) => (
            <Card key={u.id}>
              <h2 className='text-gray-800 capitalize text-xl font-bold'>{u.name}</h2>
              <Button click={() => sendFriendRequestHandler(u.id)}>Add</Button>
            </Card>
          ))}
      </label>
    </div>
  );
};

export default AddFriend;
