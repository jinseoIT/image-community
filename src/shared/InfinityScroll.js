import React from 'react'
import _ from 'lodash';
import {Spinner} from '../elements'

const InfinityScroll = (props) => {

  const { callNext, is_next, loading } = props;

  const _handleScroll = _.throttle(() => {

    if (loading) {
      return;
    }

    const { innerHeight } = window;
    const { scrollHeight } = document.body;
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

    if (scrollHeight - innerHeight - scrollTop < 200) {
      callNext();
    }
  }, 300);

  const _handelScroll = React.useCallback(_handleScroll, [loading]);

  React.useEffect(() => {
    if (loading) {
      return;
    }
    
    if (is_next) {
      window.addEventListener('scroll', _handelScroll);  
    } else {
      window.removeEventListener('scroll', _handelScroll);
    }
    
    
    return () => window.removeEventListener('scroll', _handelScroll);
  }, [is_next, loading])

  return (
    <>
      {props.children}
      {is_next && (<Spinner/>)}
    </>
  )
}
InfinityScroll.defaultPorps = {
  children: null,
  callNext: () => {},
  is_next: false,
  loading: false,
}

export default InfinityScroll;
