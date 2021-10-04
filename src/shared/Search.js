import React from 'react';
import _ from 'lodash';

const Search = () => {
    
  const [text, setText] = React.useState('');

  const debounce = _.debounce((e) => {
    console.log('debounce :::', e.target.value);
  }, 1000);

  // const throttle = _.throttle((e) => {
  //   console.log('throttle ::: ', e.target.value);
  // }, 1000)

  const keypress = React.useCallback(debounce, [text]);

  const onChange = (e) => {
    setText(e.target.value);
    keypress(e);
  }

  return (
    <div>
      <input type="text" onChange={onChange}/>
    </div>
  )
}

export default Search