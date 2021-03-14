import React, { useState } from 'react';
import { getUsersByName, sendFriendRequest } from '../../services/Friends/friends.service';
import buttonStyle from '../../shared/components/buttonStyle';
import Card from '../../shared/components/Card';

const AddFriend = (props) => {
  const { user } = props;
  const [friendName, setFriendName] = useState('');
  const [users, setUsers] = useState([]);

  const searchFriend = async (e) => {
    setFriendName(e.target.value);
    const result = await getUsersByName(user.authId, e.target.value);
    setUsers(result);
  };

  const sendFriendRequestHandler = async (friend) => {
    const res = await sendFriendRequest(user.authId, friend.authId);
    setUsers((prev) => {
      prev = prev.filter((f) => f.authId !== friend.authId);
      return [...prev, { ...friend, sent: true }];
    });
  };

  return (
    <div>
      <label>
        name:
        <input type='text' onChange={searchFriend} value={friendName} />
        {users &&
          users.map((u) => (
            <Card key={u.authId}>
              <h2 className='text-gray-800 capitalize text-xl font-bold'>{u.name}</h2>
              <button disabled={u.sent} className={buttonStyle()} onClick={() => sendFriendRequestHandler(u)}>
                {u.sent ? 'Sent' : 'Add'}
              </button>
            </Card>
          ))}
      </label>
    </div>
  );
};

export default AddFriend;
