
import { Switch, Route } from 'react-router-dom';
import GroupsFriendsPage from '../../pages/GroupsFriendsPage';
import { useState, useEffect } from 'react';

const SocialRouter = props => {
    const [userId, setUserId] = useState("")
    useEffect(() => {
        setUserId("2ee1ab6f-b701-422e-8244-161335b89fbb");
    }, [])
    return (
        <Switch>
            <Route path='/social' render={(props) => <GroupsFriendsPage userId={userId} />} />
        </Switch>
    )
}

export default SocialRouter;