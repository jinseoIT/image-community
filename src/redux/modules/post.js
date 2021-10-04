import { createAction, handleActions } from 'redux-actions';
import { produce } from 'immer';
import { firestore, storage } from '../../shared/firebase';
import "moment";
import moment from 'moment';

import { actionCreators as imageActions } from './image';

const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";
const LOADING = "LOADING";

const setPost = createAction(SET_POST, (post_list, paging) => ({ post_list, paging }));
const addPost = createAction(ADD_POST, (post) => ({ post }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({post_id, post}));

const initialState = {
  list: [],
  paging: { state: null, next: null, size: 3 },
  is_loading: false,
};
const loading = createAction(LOADING, (is_loading) => ({is_loading}))

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

const getPostFB = (start =null, size = 3) => {
  return function (dispatch, getState, { history }) {
    console.log(getState().post.paging);
    let _paging = getState().post.paging;
    
    if (_paging.start && !_paging.next) {
      return;
    }
    dispatch(loading(true));

    const postDB = firestore.collection('post');
    let query = postDB.orderBy('insert_dt', 'desc')

    if (start) {
      query = query.startAt(start);
    }
    query
      .limit(size+1)
      .get()
      .then(docs => {
        let post_list = [];
        let paging = {
          start: docs.docs[0],
          next: docs.docs.length === size + 1 ? docs.docs[docs.docs.length - 1] : null,
          size: size,
        }
        docs.forEach((doc) => {
          let _post = doc.data();
          let post = Object.keys(_post).reduce((acc, cur) => {
            if (cur.indexOf('user_') !== -1) {
              return {
                ...acc,
                user_info: { ...acc.user_info, [cur]: _post[cur] },
              };
            }
            return { ...acc, [cur]: _post[cur] }
          }, { id: doc.id, user_info: {} });
          post_list.push(post);
        });
        post_list.pop();
      console.log(post_list);
      dispatch(setPost(post_list, paging));
    })
  }
}

const editPostFB = (post_id = null, post = {}) => {
  return function (dispatch, getState, { history }) {
    console.log(post_id);
    if (!post_id) {
      console.log('게시글 정보가 없습니다.')
      return;
    }
    const _image = getState().image.preview;

    const _post_idx = getState().post.list.findIndex(p => p.id === post_id);
    console.log(_post_idx);
    const _post = getState().post.list[_post_idx];

    console.log(_post);

    const postDB = firestore.collection('post');
    if (_image === _post.image_url) {
      postDB.doc(post_id).update(post).then(doc => {
        dispatch(editPost(post_id, { ...post }));
        history.replace('/');
      })
    } else {
        const user_id = getState().user.user.uid;
        const _upload = storage.ref(`images/${user_id}_${new Date().getTime()}`).putString(_image, 'data_url')
        _upload.then(snapshot => {
          snapshot.ref.getDownloadURL().then(url => {
            console.log(url);
            return url;
        }).then(url => {
          postDB
            .doc(post_id)
            .update({...post, image_url: url})
            .then((doc) => {
              dispatch(editPost(post_id , {...post, image_url : url}))
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
    }
    
  }
}

const getOnePostFB = (id) => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection('post');
    postDB.doc(id).get().then(doc => {
      let _post = doc.data();
      let post = Object.keys(_post).reduce((acc, cur) => {
        if (cur.indexOf('user_') !== -1) {
          return {
            ...acc,
            user_info: { ...acc.user_info, [cur]: _post[cur] },
          };
        }
        return { ...acc, [cur]: _post[cur] }
      }, { id: doc.id, user_info: {} });
      dispatch(setPost([post]));
    });
  }
}

export default handleActions(
  {
    [SET_POST]: (state, action) => produce(state, (draft) => {
      draft.list.push(...action.payload.post_list);
      
      draft.list = draft.list.reduce((acc, cur) => {
        if (acc.findIndex(a => a.id === cur.id) === -1) {
          return [...acc, cur];
        } else {
          acc[acc.findIndex(a => a.id === cur.id)] = cur
          return acc;
        }
      }, []);

      if (action.payload.paging) {
        draft.paging = action.payload.paging;
      }
      draft.paging = action.payload.paging;
      draft.is_loading = false;
    }),
    [ADD_POST]: (state, action) => produce(state, (draft) => {
      draft.list.unshift(action.payload.post);
    }),
    [EDIT_POST]: (state, action) => produce(state, (draft) => {
      let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);
      draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
    }),
    [LOADING]: (state, action) => produce(state, (draft) => {
      draft.is_loading = action.payload.is_loading;
    })
  }, initialState
);

const actionCreators = {
  setPost,
  addPost,
  editPost,
  addPostFB,
  getPostFB,
  editPostFB,
  getOnePostFB,
};

export {actionCreators}