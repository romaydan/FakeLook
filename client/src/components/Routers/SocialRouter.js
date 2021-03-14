
import { Switch, Route } from 'react-router-dom';
import GroupsFriendsPage from '../../pages/GroupsFriendsPage';
const SocialRouter = props => {
    return (
        <Switch>
            <Route path='/social' component={GroupsFriendsPage} />
        </Switch>
    )
}

export default SocialRouter;
//render={(props) => <GroupsFriendsPage userId={userId} />}