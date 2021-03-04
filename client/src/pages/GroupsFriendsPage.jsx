import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

import NewGroup from '../components/Social/NewGroup';
import AddFriend from '../components/Social/AddFriend';
import Section from '../components/Social/Section';
import { getUsersFriends, blockFriend } from '../services/Social/friendsService';
import { getUsersGroup, removeGroup } from '../services/Social/groupsService';
import { getUsersByids } from '../services/Idenity';

const GroupsFriendsPage = (props) => {
  const { userId } = props;
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [modalInfo, setModalInfo] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const friendsIds = await getUsersFriends(userId);
        const friendsRes = await getUsersByids(friendsIds.data);
        setFriends(friendsRes.data);
        const usersGroupsResult = await getUsersGroup(userId);
        setGroups(usersGroupsResult.data);
      } catch (error) {
        console.log('error.message :>> ', error.message);
      }
    })();
  }, [userId]);
  useEffect(() => {
    console.log('groups :>> ', groups);
  }, [groups]);
  const blockFriendHandler = async (friendId) => {
    blockFriend(userId, friendId);
  };

  const removeGroupHandler = async (groupId) => {
    const res = await removeGroup(groupId, props.userId);
    setGroups(res);
  };

  const groupsModalHandler = () => {
    setModalInfo(true);
    setShowModal(true);
  };

  const friendsModalHandler = () => {
    setModalInfo(false);
    setShowModal(true);
  };

  const closeModalHandler = () => {
    setShowModal(false);
  };

  return (
    <div className=' grid grid-cols-2'>
      <div>
        <Section
          title='groups'
          list={groups}
          firstCardBtnClick={removeGroupHandler}
          secondCardBtnClick={removeGroupHandler}
          createBtnClick={groupsModalHandler}
        ></Section>
      </div>
      <div>
        <Section title='friends' list={friends} firstBtnClick={blockFriendHandler} createBtnClick={friendsModalHandler}></Section>
      </div>
      {showModal ? (
        <Modal isOpen={showModal} onRequestClose={closeModalHandler}>
          {modalInfo ? <NewGroup userId={userId}></NewGroup> : <AddFriend userId={userId}></AddFriend>}
        </Modal>
      ) : null}
    </div>
  );
};

export default GroupsFriendsPage;
