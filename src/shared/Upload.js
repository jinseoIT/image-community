import React from 'react';
import { Button } from '../elements';
import { actionCreators as imageActions } from '../redux/modules/image'
import { useDispatch, useSelector } from 'react-redux';

const Upload = (props) => {
  const dispatch = useDispatch();
  const is_uploading = useSelector(state => state.image.uploading);
  const fileInput = React.useRef();

  const selectFile = (e) => {

    const reader = new FileReader();
    const file = fileInput.current.files[0];

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      dispatch(imageActions.setPreview(reader.result));
    }
  }
  const uploadFB = () => {
    let image = fileInput.current.files[0];
    dispatch(imageActions.uploadImageFB(image));
  }
  return (
    <>
      <input type="file" onChange={selectFile} ref={fileInput} disabled={is_uploading}/>
      <Button _onClick={uploadFB}>업로드하기</Button>
    </> 
  )
}

export default Upload;