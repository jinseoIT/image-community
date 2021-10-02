import React from 'react';
import { Button } from '../elements';
import { storage } from './firebase';
const Upload = (props) => {
  const fileInput = React.useRef();

  const selectFile = (e) => {
    console.log(e);
    console.log(e.target);
    console.log(e.target.files[0]);

    console.log(fileInput.current.files[0]);
  }
  const uploadFB = () => {
    let image = fileInput.current.files[0];
    const _upload = storage.ref(`images/${image.name}`).put(image);
    _upload.then((snapshot) => {
      console.log(snapshot);
    })
  }
  return (
    <>
      <input type="file" onChange={selectFile} ref={fileInput} />
      <Button _onClick={uploadFB}>업로드하기</Button>
    </> 
  )
}

export default Upload;