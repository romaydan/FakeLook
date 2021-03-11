import React, { useEffect, useState, useReducer } from 'react';
import { useForm } from 'react-hook-form';
import { getFriends } from '../../services/Friends/friends.service';
import { addFriendToGroup, addNewGroup, removeFriendFromGroup, getGroup } from '../../services/Groups/groups.service';
import Button from '../../shared/components/Button';
import DragCard from '../../shared/components/DragCard';
import DropBox from '../../shared/components/DropBox';
const ACTIONS = {
  ADD_TO_LIST_A: 'ADD_TO_LIST_A',
  ADD_TO_LIST_B: 'ADD_TO_LIST_B',
  INIT_LIST_A: 'INIT_LIST_A',
  INIT_LIST_B: 'INIT_LIST_B',
  INIT_LISTS: 'INIT_LISTS',
};
const dndReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_TO_LIST_A:
      console.log('payload :>> ', action.payload);
      state.a = [...state.a, action.payload];
      state.b = state.b.filter((i) => i.id !== action.payload.id);
      break;
    case ACTIONS.ADD_TO_LIST_B:
      console.log('payload :>> ', action.payload);
      state.b = [...state.b, action.payload];
      state.a = state.a.filter((i) => i.id !== action.payload.id);

      break;
    case ACTIONS.INIT_LIST_A:
      state.a = action.payload;
      break;
    case ACTIONS.INIT_LIST_B:
      state.b = action.payload;
      break;
    default:
      break;
    case ACTIONS.INIT_LISTS:
      console.log('payload :>> ', action.payload);
      state.a = [...action.payload.a];
      state.b = [...action.payload.b];
  }
  return { ...state };
};
const NewGroup = (props) => {
  const { userId, groupId } = props;
  const { register, handleSubmit } = useForm();
  const [group, setGroup] = useState(groupId);
  const [state, dispatch] = useReducer(dndReducer, { a: [], b: [] });
  useEffect(() => {
    (async () => {
      if (group === groupId) {
        const dbGrp = await getGroup(groupId, userId);
        console.log('dbGrp', dbGrp);
        setGroup(dbGrp);
        const friends = await getFriends(userId);
        let friendsNotGrp = friends.filter((f) => !dbGrp.friends.map((gf) => gf.id).includes(f.id));
        console.log('friendsNotGrp :>> ', friendsNotGrp);
        dispatch({ type: ACTIONS.INIT_LISTS, payload: { a: friendsNotGrp, b: dbGrp.friends } });
      }
    })();
  }, []);

  const addFriendHandler = async ({ item }) => {
    try {
      const res = await addFriendToGroup(userId, group.id, item);
      console.log('res :>> ', res);
      const friendF = state.a.find((f) => f.id === item);
      dispatch({ type: ACTIONS.ADD_TO_LIST_B, payload: friendF });
    } catch (error) {
      console.log(error.message);
    }
  };

  const removeFriendHandler = async ({ item }) => {
    try {
      const res = await removeFriendFromGroup(group.id, userId, item);
      const friendF = state.b.find((f) => f.id === item);
      console.log('res :>> ', res);
      dispatch({ type: ACTIONS.ADD_TO_LIST_A, payload: friendF });
    } catch (error) {
      console.log(error.message);
    }
  };

  const onSubmit = async (formData) => {
    try {
      console.log('formData :>> ', formData);
      const { data } = await addNewGroup(userId, formData.name);
      console.log('data :>> ', data);
      let grp = { ...data, friends: [] };
      setGroup(grp);
      const friends = await getFriends(userId);
      dispatch({ type: ACTIONS.INIT_LIST_A, payload: friends });
    } catch (error) {
      console.log('error.message :>> ', error.message);
    }
  };
  return (
    <div className='text-center'>
      {group !== groupId ? (
        <div className='grid grid-cols-2'>
          <h1 className='col-span-2'>{group.name}</h1>
          <div>
            <h1>Friends</h1>
            <DropBox onDrop={removeFriendHandler}>
              {state.a.map((f) => {
                console.log('f', f);
                return (
                  <DragCard key={f.id} id={f.id}>
                    <h1>{f.name}</h1>
                  </DragCard>
                );
              })}
            </DropBox>
          </div>
          <div>
            <h1>Friends In Group</h1>
            <DropBox onDrop={addFriendHandler}>
              {state.b.map((f) => {
                console.log('f', f);
                return (
                  <DragCard key={f.id} id={f.id}>
                    <h1>{f.name}</h1>
                  </DragCard>
                );
              })}
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
