import React from 'react';
import { Grid, Image, Text} from '../elements/index';

const Post = (props) => {
  
  return (
    <>
      <Grid>
        <Grid is_flex>
          <Image shpae="circle" src={props.user_info.user_profile} />
          <Text bold>{props.user_info.user_name}</Text>
          <Text>{props.insert_dt}</Text>
        </Grid>

        <Grid padding="16px">
          <Text bold>{props.contents}</Text>
        </Grid>

        <Grid>
          <Image shape="rectangle" src={props.image_url}/>
        </Grid>
          
        <Grid padding="16px">
          <Text margin="0px" bold>댓글 {props.comment_cnt}개</Text>
        </Grid>
      </Grid>
    </>
  )
}

Post.defaultProps = {
  user_info: {
    user_name: "mean0",
    user_profile: "https://menu.mt.co.kr/moneyweek/thumb/2021/08/29/06/2021082909088076498_1.jpg",  
  },
  image_url: "https://w.namu.la/s/f21af41d2334b16f5da4c187b6f38ee910673da611ac33ec15be826208cdce02afcb2cd7096414957ef6be53537b75547e8e279ad3400029da948e04b955fd33c7a382087a9a6e265553a7eb4e992dc8b11d3007a678a2d90cdf991e057c57e3",
  contents: "노제입니다.",
  comment_cnt: 10,
  insert_dt: "2021-02-27 10:00:00",
};

export default Post;