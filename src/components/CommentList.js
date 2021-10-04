import React from 'react'
import { Grid, Image, Text } from '../elements';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as commentActions } from '../redux/modules/comment';

const CommentList = (props) => {
  const dispatch = useDispatch();
  const comment_list = useSelector(state => state.comment.list);
  const { post_id } = props;

  React.useEffect(() => {
    if (!comment_list[post_id]) {
      dispatch(commentActions.getCommentFB(post_id));
    }
  }, []);
  /* commentList 나 post_id 가 없으면 return null */
  if (!comment_list[post_id] || !post_id) {
    return null;
  }
  
  return (
    <>
      <Grid padding="16px">
        {comment_list[post_id].map(c => {
          return <CommentItem key={c.id} {...c}/>
        })}
      </Grid>
    </>
  )
}

export default CommentList

CommentList.defaultProps = {
  post_id : null,
}

const CommentItem = (props) => {

  const {user_name, contents,insert_dt } = props;
  return (
    <>
      <Grid is_flex>
        <Grid is_flex width="auto" margin="0px 6px 0px 0px ">
          <Image shape="circle" />
          <Text bold>{user_name}</Text>
        </Grid>
        <Grid is_flex margin="0px 4px">
          <Text margin="0px">{contents}</Text>
          <Text margin="0px">{insert_dt}</Text>
        </Grid>
      </Grid>
    </>
  )
}

CommentItem.defaultProps = {
  user_profile: '',
  user_name: 'noje',
  user_id: '',
  post_id: 1,
  insert_dt: '2021-01-01 19:00:00',
  contents: '잘 부탁 드려요!'
}
