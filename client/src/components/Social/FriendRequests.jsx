import React, { useEffect, useState } from 'react';
import { acceptFriendRequest, declineFriendRequest, getRequests } from '../../services/Friends/friends.service';
import buttonStyle from '../../shared/components/buttonStyle';
import Card from '../../shared/components/Card';

const FriendRequests = (props) => {
  const { user } = props;

  const [requests, setRequests] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const { data: requests } = await getRequests(user);
        setRequests(requests);
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, [user]);
  useEffect(() => {
    console.log('requests :>> ', requests);
  }, [requests]);
  const acceptFriendReqHandler = async (senderId) => {
    try {
      const res = await acceptFriendRequest(user.authId, senderId);
      await getRequests(user.authId);
      console.log('res', res);
    } catch (error) {
      console.log(error.message);
    }
  };
  const declineFriendReqHandler = async (senderId) => {
    declineFriendRequest(user.authId, senderId);
  };
  return (
    <div className='text-center'>
      {requests.length > 0 ? (
        requests.map((fr) => (
          <Card>
            <h2>{fr.name} </h2>
            <div>
              <button className={buttonStyle()} onClick={() => acceptFriendReqHandler(fr.id)}>
                Accept
              </button>
              <button className={buttonStyle('red')} onClick={() => declineFriendReqHandler(fr.id)}>
                Decline
              </button>
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
