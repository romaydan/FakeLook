import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getUsersByids } from '../../services/Idenity';
import { getUsersFriends } from '../../services/Social/friendsService';
import { addFriendToGroup, addNewGroup, removeFriendFromGroup } from '../../services/Social/groupsService';
import Button from '../../shared/components/Button';
import DragCard from '../../shared/components/DragCard';
import DropBox from '../../shared/components/DropBox';

const fetchData = async (userId) => {
  const { data: friends } = await getUsersFriends(userId);
  return { friends };
};

const NewGroup = (props) => {
  const { userId } = props;
  const { register, handleSubmit } = useForm();
  const [group, setGroup] = useState(props.group);
  const [friends, setFriends] = useState([]);
  const [groupFriends, setGroupFriends] = useState([]);

  useEffect(() => {
    console.log('group :>> ', group);
  }, [group]);
  useEffect(() => {
    if (group !== undefined) {
      (async () => {
        let { friends } = await fetchData(userId);
        let groupFriendsIds = group.friends.map((gf) => gf.friendId);
        const { data: groupFriends } = await getUsersByids(groupFriendsIds);
        setFriends(friends.filter((f) => !groupFriendsIds.includes(f.id)));
        setGroupFriends(groupFriends);
      })();
    }
  }, [group]);
  useEffect(() => {
    if (group !== undefined) {
      let dsss = groupFriends.map((gf) => gf.id);
      setFriends(props.friends.filter((f) => !dsss.includes(f.id)));
    }
  }, [groupFriends]);

  const addFriendHandler = async ({ item }) => {
    try {
      await addFriendToGroup(userId, group.id, item);
      const friendF = friends.find((f) => f.id === item);
      setGroupFriends((prev) => [...prev, friendF]);
    } catch (error) {
      console.log(error.message);
    }
  };

  const removeFriendHandler = async ({ item }) => {
    try {
      await removeFriendFromGroup(group.id, userId, item);
      setGroupFriends((prev) => prev.filter((gf) => gf.id !== item));
    } catch (error) {
      console.log(error.message);
    }
  };

  const onSubmit = async (formData) => {
    try {
      const { data } = await addNewGroup(userId, formData.name);
      let grp = { ...data, friends: [] };
      setGroup(grp);
    } catch (error) {}
  };

  return (
    <div className='text-center'>
      {group !== undefined ? (
        <div className='grid grid-cols-2'>
          <h1 className='col-span-2'>{group.name}</h1>
          <div>
            <h1>Friends</h1>
            <DropBox onDrop={removeFriendHandler}>
              {friends.map((f) => (
                <DragCard key={f.id} id={f.id}>
                  <h1>{f.name}</h1>
                </DragCard>
              ))}
            </DropBox>
          </div>
          <div>
            <h1>Friends In Group</h1>
            <DropBox onDrop={addFriendHandler}>
              {groupFriends &&
                groupFriends.map((f) => (
                  <DragCard key={f.id} id={f.id}>
                    <h1>{f.name}</h1>
                  </DragCard>
                ))}
            </DropBox>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className='m-2'>
            Name:
            <input type='text' className='m-2 bg-blue-50 rounded' ref={register} name='name' />
          </label>
          <Button type='submit'>Create!</Button>
        </form>
      )}
    </div>
  );
};

export default NewGroup;
