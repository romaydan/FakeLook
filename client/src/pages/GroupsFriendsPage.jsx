import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

import NewGroup from '../components/Social/NewGroup';
import AddFriend from '../components/Social/AddFriend';
import { blockFriend, removeFriend, getFriends, unblockFriend } from '../services/Friends/friends.service';
import { deleteGroup, getUsersGroup } from '../services/Groups/groups.service';
import Card from '../shared/components/Card';
import FriendRequests from '../components/Social/FriendRequests';
import { connect } from 'react-redux';
import buttonStyle from '../shared/components/buttonStyle';

const GroupsFriendsPage = (props) => {
  const { user } = props;
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);

  const [modalPage, setModalPage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    console.log('user :>> ', user);
    (async () => {
      try {
        const groups = await getUsersGroup(user.authId);
        const friends = await getFriends(user.authId);
        setFriends(friends);
        setGroups(groups);
      } catch (error) {
        console.log('error.message :>> ', error);
      }
    })();
  }, [user]);
  const blockFriendHandler = async (friend) => {
    try {
      if (friend.block) {
        await unblockFriend(user.authId, friend.authId);
      } else {
        await blockFriend(user.authId, friend.authId);
      }
      const friends = await getFriends(user.authId);
      setFriends(friends);
    } catch (error) {
      console.log('error.message :>> ', error.message);
    }
  };

  const removeFriendHandler = async (friend) => {
    console.log('friendId  :>> ', friend.authId);
    const res = await removeFriend(user.authId, friend.authId);
    setFriends((prev) => prev.filter((f) => f.authId !== friend.authId));
  };

  const editGroupHandler = async (groupId) => {
    setModalPage(<NewGroup groupId={groupId} user={user} friends={friends}></NewGroup>);
    setShowModal(true);
  };

  const removeGroupHandler = async (groupId) => {
    try {
      await deleteGroup(groupId, user.authId);
      const { data: groups } = await getUsersGroup(user.authId);
      setGroups(groups);
    } catch (error) {
      console.log('error :>> ', error.message);
    }
  };
  const groupsModalHandler = () => {
    setModalPage(<NewGroup user={user} friends={friends}></NewGroup>);
    setShowModal(true);
  };

  const friendsModalHandler = () => {
    setModalPage(<AddFriend user={user}></AddFriend>);
    setShowModal(true);
  };

  const showFriendRequests = () => {
    setModalPage(<FriendRequests user={user}></FriendRequests>);
    setShowModal(true);
  };
  const closeModalHandler = async () => {
    setShowModal(false);
    const groups = await getUsersGroup(user.authId);
    const friends = await getFriends(user.authId);

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
            <button className={buttonStyle()} onClick={groupsModalHandler}>
              Add Groups
            </button>
          </div>
          {groups && groups.length > 0
            ? groups.map((group) => (
                <Card title={group.name} key={group.id}>
                  <h2 className='text-gray-800 capitalize text-xl font-bold '>{group.name}</h2>

                  <div>
                    <button className={buttonStyle()} onClick={() => editGroupHandler(group.id)}>
                      Edit
                    </button>
                    <button className={buttonStyle('red', 'm-2')} onClick={() => removeGroupHandler(group.id)}>
                      Remove
                    </button>
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
              <button className={buttonStyle('blue', 'm-2')} onClick={friendsModalHandler}>
                Add Friends
              </button>
              <button className={buttonStyle()} onClick={showFriendRequests}>
                FriendRequests
              </button>
            </div>
          </div>
          {friends && friends.length > 0
            ? friends.map((friend) => (
                <Card title={friend.name} key={friend.id}>
                  <h2 className='text-gray-800 capitalize text-xl font-bold '>{friend.name}</h2>
                  <div>
                    <button className={buttonStyle('green')} onClick={() => blockFriendHandler(friend)}>
                      {friend.block ? 'Unblock' : ' Block'}
                    </button>
                    <button className={buttonStyle('red', 'm-2')} onClick={() => removeFriendHandler(friend)}>
                      Remove
                    </button>
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

const mapStateToProps = (state) => ({
  user: state.user,
  friends: state.friends,
});
export default connect(mapStateToProps)(GroupsFriendsPage);
