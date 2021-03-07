import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

import NewGroup from '../components/Social/NewGroup';
import AddFriend from '../components/Social/AddFriend';
import { getUsersFriends, blockFriend, removeFriend, getUsersBlocks, unblockFriend } from '../services/Social/friendsService';
import { deleteGroup, getUsersGroup } from '../services/Social/groupsService';
import Card from '../shared/components/Card';
import Button from '../shared/components/Button';
import FriendRequests from '../components/Social/FriendRequests';
import { getUsersByids } from '../services/Idenity';

const getUsersData = async (userId) => {
  const { data: blocks } = await getUsersBlocks(userId);
  const { data: friendsRes } = await getUsersFriends(userId);
  const friends = friendsRes.map((f) => (blocks.includes(f.id) ? { ...f, blocked: true } : f));
  const { data: userRes } = await getUsersByids([userId]);
  const user = userRes[0];
  let groups = [];
  try {
    let { data: groupsRes } = await getUsersGroup(userId);
    groups = groupsRes;
  } catch (error) {}
  return { groups, friends, user };
};
const GroupsFriendsPage = (props) => {
  const { userId } = props;
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [user, setUser] = useState({ name: 'name' });
  const [modalPage, setModalPage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {}, [friends]);
  useEffect(() => {
    (async () => {
      try {
        let { friends, groups, user: userRes } = await getUsersData(userId);
        setFriends(friends);
        setGroups(groups);
        setUser(userRes);
      } catch (error) {
        console.log('error.message :>> ', error);
      }
    })();
  }, [userId]);
  useEffect(() => {}, [groups]);
  const blockFriendHandler = async (friend) => {
    try {
      if (friend.blocked) {
        await unblockFriend(userId, friend.id);
      } else {
        await blockFriend(userId, friend.id);
      }
      const { friends } = await getUsersData(userId);
      setFriends(friends);
    } catch (error) {
      console.log('error.message :>> ', error.message);
    }
  };

  const removeGroupHandler = async (groupId) => {
    try {
      await deleteGroup(groupId, props.userId);
      setGroups((prev) => prev.filter((g) => g.id !== groupId));
    } catch (error) {
      console.log('error :>> ', error.message);
    }
  };
  const removeFriendHandler = async (friendId) => {
    const res = await removeFriend(userId, friendId);
    console.log(res);
  };

  const editGroupHandler = async (group) => {
    setModalPage(<NewGroup group={group} userId={userId} friends={friends}></NewGroup>);
    setShowModal(true);
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
    let { friends, groups } = await getUsersData(userId);
    setFriends(friends);
    setGroups(groups);
  };

  return (
    <div className=' grid grid-cols-2'>
      <div>
        <h2 className='text-center'>{user.name}</h2>
        <div className='p-3'>
          <div className='flex justify-evenly'>
            <h1 className='text-center text-4xl capitalize p-2 font-bold'>Groups</h1>
            <Button className='capitalize ' click={groupsModalHandler}>
              Add groups
            </Button>
          </div>
          {groups.length > 0
            ? groups.map((group) => (
                <Card title={group.name} key={group.id}>
                  <h2 className='text-gray-800 capitalize text-xl font-bold '>{group.name}</h2>

                  <div>
                    <Button color='blue-400' click={() => editGroupHandler(group)}>
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
          {friends.length > 0
            ? friends.map((friend) => (
                <Card title={friend.name} key={friend.id}>
                  <h2 className='text-gray-800 capitalize text-xl font-bold '>{friend.name}</h2>
                  <div>
                    <Button color='blue-400' click={() => blockFriendHandler(friend)}>
                      {friend.blocked ? 'Unblock' : ' Block'}
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
