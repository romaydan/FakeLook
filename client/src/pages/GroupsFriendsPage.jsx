import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

import NewGroup from '../components/Social/NewGroup';
import AddFriend from '../components/Social/AddFriend';
import { blockFriend, removeFriend, getFriends, unblockFriend } from '../services/Friends/friends.service';
import { deleteGroup, getUsersGroup } from '../services/Groups/groups.service';
import Card from '../shared/components/Card';
import Button from '../shared/components/Button';
import FriendRequests from '../components/Social/FriendRequests';

const GroupsFriendsPage = (props) => {
  const { userId } = props;
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  // const [user, setUser] = useState({ name: 'no userFound' });
  const [modalPage, setModalPage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {}, [friends]);
  useEffect(() => {
    (async () => {
      try {
        const groups = await getUsersGroup(userId);
        const friends = await getFriends(userId);
        console.log('friends :>> ', friends);
        setFriends(friends);
        setGroups(groups);
      } catch (error) {
        console.log('error.message :>> ', error);
      }
    })();
  }, [userId]);
  // useEffect(() => {    console.log('userId', userId);  }, [userId]);
  const blockFriendHandler = async (friend) => {
    try {
      if (friend.block) {
        await unblockFriend(userId, friend.id);
      } else {
        await blockFriend(userId, friend.id);
      }
      const friends = await getFriends(userId);
      setFriends(friends);
    } catch (error) {
      console.log('error.message :>> ', error.message);
    }
  };

  const removeFriendHandler = async (friendId) => {
    console.log('friendId  :>> ', friendId);
    const res = await removeFriend(userId, friendId);
    setFriends((prev) => prev.filter((f) => f.authId != friendId));
  };

  const editGroupHandler = async (groupId) => {
    setModalPage(<NewGroup groupId={groupId} userId={userId} friends={friends}></NewGroup>);
    setShowModal(true);
  };

  const removeGroupHandler = async (groupId) => {
    try {
      await deleteGroup(groupId, props.userId);
      const { data: groups } = await getUsersGroup(userId);
      setGroups(groups);
    } catch (error) {
      console.log('error :>> ', error.message);
    }
  };
  const groupsModalHandler = () => {
    setModalPage(<NewGroup userId={userId} friends={friends}></NewGroup>);
    setShowModal(true);
  };

  const friendsModalHandler = () => {
    setModalPage(<AddFriend userId={userId}></AddFriend>);
    setShowModal(true);
  };

  const showFriendRequests = () => {
    setModalPage(<FriendRequests userId={userId}></FriendRequests>);
    setShowModal(true);
  };
  const closeModalHandler = async () => {
    setShowModal(false);
    const groups = await getUsersGroup(userId);
    const friends = await getFriends(userId);

    setFriends(friends);
    setGroups(groups);
  };

  return (
    <div className=' grid grid-cols-2'>
      <div>
        {/* <h2 className='text-center'>{user.name}</h2> */}
        <div className='p-3'>
          <div className='flex justify-evenly'>
            <h1 className='text-center text-4xl capitalize p-2 font-bold'>Groups</h1>
            <Button className='capitalize ' click={groupsModalHandler}>
              Add groups
            </Button>
          </div>
          {groups && groups.length > 0
            ? groups.map((group) => (
                <Card title={group.name} key={group.id}>
                  <h2 className='text-gray-800 capitalize text-xl font-bold '>{group.name}</h2>

                  <div>
                    <Button color='blue-400' click={() => editGroupHandler(group.id)}>
                      Edit
                    </Button>
                    <Button color='red-300' click={() => removeGroupHandler(group.id)}>
                      Remove
                    </Button>
                  </div>
                </Card>
              ))
            : null}
        </div>
      </div>

      <div>
        <div className='p-3'>
          <div className='flex justify-evenly'>
            <h1 className='text-center text-4xl capitalize p-2 font-bold'>Friends</h1>
            <div>
              <Button className='capitalize ' click={friendsModalHandler}>
                Add Friends
              </Button>
              <Button className='capitalize ' click={showFriendRequests}>
                FriendRequests
              </Button>
            </div>
          </div>
          {friends && friends.length > 0
            ? friends.map((friend) => (
                <Card title={friend.name} key={friend.id}>
                  <h2 className='text-gray-800 capitalize text-xl font-bold '>{friend.name}</h2>
                  <div>
                    <Button color='blue-400' click={() => blockFriendHandler(friend)}>
                      {friend.block ? 'Unblock' : ' Block'}
                    </Button>
                    <Button color='red-300' click={() => removeFriendHandler(friend.id)}>
                      Remove
                    </Button>
                  </div>
                </Card>
              ))
            : null}
        </div>
      </div>
      {showModal ? (
        <Modal isOpen={showModal} onRequestClose={closeModalHandler}>
          {modalPage}
        </Modal>
      ) : null}
    </div>
  );
};

export default GroupsFriendsPage;
