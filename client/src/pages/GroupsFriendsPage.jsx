import React, { useState, useEffect } from 'react';
import Section from '../components/Section';
import Button from '../shared/components/Button';
import Modal from '../shared/components/Modal';
import { getUsersGroup, removeGroup } from '../shared/utils/services/groupsService';

const GroupsFriendsPage = (props) => {
  // const { userId } = props;
  const userId = '87d5efa2-46ea-4604-86a6-b390f459ba74';
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    setFriends(mockFriends);
    setGroups(getUsersGroup(userId));
  }, []);

  const blockFriend = async (friendId) => {};
  const removeGroupHandler = async (groupId) => {
    const res = await removeGroup(groupId, props.userId);
    setGroups(res);
  };

  const groupsModalHandler = () => {
    setShowModal(true);
  };

  const closeModalHandler = () => {
    setShowModal(false);
  };
  return (
    <div className=' grid grid-cols-2'>
      <div>
        <Section title='groups' list={groups} itemBtnClick={removeGroupHandler} createBtnClick={groupsModalHandler}></Section>
      </div>
      <div>
        <Section title='friends' list={friends} itemBtnClick={blockFriend}></Section>
      </div>
      {showModal ? (
        <Modal
          closeModal={closeModalHandler}
          footer={
            <>
              {' '}
              <Button type='button' style={{ transition: 'all .15s ease' }} onClick={closeModalHandler}>
                Close
              </Button>
              <Button color='green-500'>Save Changes</Button>
            </>
          }
        ></Modal>
      ) : null}
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
