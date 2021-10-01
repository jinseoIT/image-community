import React from 'react'
import { Grid, Text, Button } from '../elements/index'

import {useDispatch } from 'react-redux';
import { actionCreators as userActions } from '../redux/modules/user';
import { history } from '../redux/configureStore';
import Permit from '../shared/Permit';

const Header = (props) => {
  const dispatch = useDispatch();
  
  <Permit>
      <>
        <Grid is_flex padding="4px 16px">
          <Grid>
            <Text margin="0px" size="24px" bold>Image-Community</Text>
          </Grid>
  
          <Grid is_flex>
            <Button text="내정보"></Button>
            <Button text="알림"></Button>
            <Button text="로그아웃" _onClick={() => {
              dispatch(userActions.logoutFB({}));
            }}></Button>
          </Grid>
       </Grid>
      </>
  </Permit>

  
  return (
    <>
      <Grid is_flex padding="4px 16px">
        <Grid>
          <Text margin="0px" size="24px" bold>Image-Community</Text>
        </Grid>

        <Grid is_flex>
          <Button text="로그인" _onClick={() => history.push('/login')}></Button>
          <Button text="회원가입" _onClick={ () => history.push('/signup')}></Button>
        </Grid>
     </Grid>
    </>
  )
}

Header.defaultPorps = {}

export default Header
