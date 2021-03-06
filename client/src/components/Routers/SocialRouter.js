
import { Switch, Route } from 'react-router-dom';
import GroupsFriendsPage from '../../pages/GroupsFriendsPage';
import { useState, useEffect } from 'react';

const SocialRouter = props => {
    const [userId, setUserId] = useState("")
    useEffect(() => {
        setUserId("cc19e705-41fc-4037-9a7b-c5b488f87a53");
        // setUserId("2ee1ab6f-b701-422e-8244-161335b89fbb");
        // setUserId("1716dc65-485f-4447-92ca-d780f708cb1d");
    }, [])
    return (
        <Switch>
            <Route path='/social' render={(props) => <GroupsFriendsPage userId={userId} />} />
        </Switch>
    )
}

export default SocialRouter;