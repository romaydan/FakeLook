import React, { useEffect, useState } from 'react';
import { acceptFriendRequest, declineFriendRequest, getRequests } from '../../services/Friends/friends.service';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';

const FriendRequests = (props) => {
  const { userId } = props;

  const [requests, setRequests] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const { data: requests } = await getRequests(userId);
        setRequests(requests);
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, [userId]);
  useEffect(() => {
    console.log('requests :>> ', requests);
  }, [requests]);
  const acceptFriendReqHandler = async (senderId) => {
    try {
      const res = await acceptFriendRequest(userId, senderId);
      await getRequests(userId);
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
