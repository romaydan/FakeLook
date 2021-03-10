import { Switch, Route } from 'react-router-dom';
import Map from '../Posts/Map/Map';
import Feed from '../Posts/Feed/Feed';

const PostRouter = props => {

    return (
        <Switch>
            <Route path='/map*' component={Map} />
            <Route path='/feed' component={Feed} />
        </Switch>
    )
}

export default PostRouter;