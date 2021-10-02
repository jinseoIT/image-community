import { createAction, handleActions } from 'redux-actions';
import { produce } from 'immer';
import { firestore, storage } from '../../shared/firebase';
import "moment";
import moment from 'moment';

import { actionCreators as imageActions } from './image';

const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";

const setPost = createAction(SET_POST, (post_list) => ({ post_list }));
const addPost = createAction(ADD_POST, (post) => ({ post }));

const initialState = {
  list: [],
};

const initailPost = {
  // id: 0,
  // user_info: {
  //   user_name: "mean0",
  //   user_profile: "https://menu.mt.co.kr/moneyweek/thumb/2021/08/29/06/2021082909088076498_1.jpg",
  // },
  image_url: "https://w.namu.la/s/f21af41d2334b16f5da4c187b6f38ee910673da611ac33ec15be826208cdce02afcb2cd7096414957ef6be53537b75547e8e279ad3400029da948e04b955fd33c7a382087a9a6e265553a7eb4e992dc8b11d3007a678a2d90cdf991e057c57e3",
  contents: "",
  comment_cnt: 0,
  insert_dt: moment().format("YYYY-MM-DD HH:mm:ss"),
};

const addPostFB = (contents="") => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection('post');
    const _user = getState().user.user;
    const user_info = {
      user_name: _user.user_name,
      user_id: _user.uid,
      // user_profile: _user.user_profile
      user_profile: "https://menu.mt.co.kr/moneyweek/thumb/2021/08/29/06/2021082909088076498_1.jpg",
    };
    const _post = {
      ...initailPost,
      contents: contents,
      insert_dt: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    const _image = getState().image.preview;
    
    console.log(_image);

    const _upload = storage.ref(`images/${user_info.user_id}_${new Date().getTime()}`).putString(_image, 'data_url')
    _upload.then(snapshot => {
      snapshot.ref.getDownloadURL().then(url => {
        console.log(url);
        return url;
      }).then(url => {
        postDB
          .add({ ...user_info, ..._post, image_url: url })
          .then((doc) => {
            let post = { user_info, ..._post, id: doc.id, image_url: url };
            dispatch(addPost(post))
            history.replace('/');
            dispatch(imageActions.setPreview(null));
          }).catch((err) => {
            window.alert('포스트 작성에 문제가 있습니다.')
            console.log('post 작성에 실패했어요!', err);
          }).catch((err) => {
            window.alert('이미지 업로드에 문제가 있습니다.')
            console.log('이미지 업로드에 실패하였습니다.', err);
        })    
      })
    })
    return;
    
  }
}

const getPostFB = () => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection('post');

    postDB.get().then((docs) => {
      let post_list = [];
      docs.forEach((doc) => {
        let _post = doc.data();
        let post = Object.keys(_post).reduce((acc, cur) => {
          if (cur.indexOf('user_') !== -1) {
            return {
              ...acc,
              user_info: { ...acc.user_info, [cur]: _post[cur] },
            };
          }
          return {...acc, [cur]: _post[cur]}
        }, { id: doc.id, user_info: {} });
        post_list.push(post);
      })
      console.log(post_list);
      dispatch(setPost(post_list));
    })
  }
}

export default handleActions(
  {
    [SET_POST]: (state, action) => produce(state, (draft) => {
      draft.list = action.payload.post_list;
    }),
    [ADD_POST]: (state, action) => produce(state, (draft) => {
      draft.list.unshift(action.payload.post);
    })
  }, initialState
);

const actionCreators = {
  setPost,
  addPost,
  addPostFB,
  getPostFB,
};

export {actionCreators}