import React, { useEffect, useState } from 'react';
import { getUsersByids } from '../../services/Idenity';
import { acceptFriendRequest, declineFriendRequest, getUsersFriendRequests } from '../../services/Social/friendsService';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
const getUsersRequests = async (userId) => {
  try {
    const { data } = await getUsersFriendRequests(userId);
    return getUsersByids(data);
  } catch (error) {
    console.log(error.message);
  }
};

const FriendRequests = (props) => {
  const { userId } = props;

  const [requests, setRequests] = useState([]);
  useEffect(() => {
    (async () => {
      const reqRes = await getUsersRequests();
      setRequests(reqRes);
    })();
  }, [userId]);
  useEffect(() => {
    console.log('requests :>> ', requests);
  }, [requests]);
  const acceptFriendReqHandler = async (senderId) => {
    try {
      const res = await acceptFriendRequest(userId, senderId);
      await getUsersRequests(userId);
      console.log('res', res);
    } catch (error) {
      console.log(error.message);
    }
  };
  const declineFriendReqHandler = async (senderId) => {
    declineFriendRequest(userId, senderId);
  };
  return (
    <div className='text-center'>
      {requests.length > 0 ? (
        requests.map((fr) => (
          <Card>
            <h2>{fr.name} </h2>
            <div>
              <Button click={() => acceptFriendReqHandler(fr.id)}>Accept</Button>
              <Button click={() => declineFriendReqHandler(fr.id)}>Decline</Button>
            </div>
          </Card>
        ))
      ) : (
        <h2>No Friend Requests</h2>
      )}
    </div>
  );
};

export default FriendRequests;