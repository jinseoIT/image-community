import React from 'react'
import { Grid, Input, Button } from '../elements';



const CommentWrite = () => {
  return (
    <>
      <Grid padding="16px" is_flex>
        <Input placeholder="댓글을 내용을 입력해주세요." />
        <Button width='50px' margin='0px 2px 0px 2px'>작성</Button>
      </Grid>
    </>
  )
}

export default CommentWrite
