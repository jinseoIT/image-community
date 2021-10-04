import './App.css';
import React from 'react';

import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { history } from '../redux/configureStore';

import Header from '../components/Header'
import PostList from '../pages/PostList';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import PostWirte from '../pages/PostWrite';
import PostDetail from '../pages/PostDetail';
import Search from './Search';
import Notification from '../pages/Notification';

import { Grid, Button } from '../elements/index'
import Permit from '../shared/Permit'

import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as userActions } from '../redux/modules/user';
import { apiKey } from './firebase';

function App() {
  const dispatch = useDispatch();
  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`
  const is_session = sessionStorage.getItem(_session_key) ? true : false;
  const is_login = useSelector(state => state.user.is_login);

  React.useEffect(() => {
    if (is_session) {
      dispatch(userActions.loginCheckFB());
    }
  })
  return (
    <React.Fragment>
      <Grid>
        <Header is_session={is_session} is_login={is_login}/>
      <ConnectedRouter history={history}>
        <Route path="/" exact component={PostList}/>
        <Route path="/login" exact component={Login}/>
        <Route path="/signup" exact component={Signup}/>
        <Route path="/write" exact component={PostWirte}/>
        <Route path="/write/:id" exact component={PostWirte}/>
        <Route path="/post/:id" exact component={PostDetail}/>
        <Route path="/search" exact component={Search} />
        <Route path="/noti" exact component={Notification}/>
      </ConnectedRouter>
      </Grid>
      <Permit>
        <Button is_float text="+" _onClick={() => {history.push('/write')}}></Button>
      </Permit>
    </React.Fragment>
  );
}

export default App;
