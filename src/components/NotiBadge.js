import React from 'react'
import { Badge } from '@material-ui/core'
import NotificationIcon from '@material-ui/icons/Notifications';

import { realtime } from '../shared/firebase';
import { useSelector } from 'react-redux';

const NotiBadge = (props) => {
  
  const [is_read, setIsRead] = React.useState(true);
  const user_id = useSelector(state => state.user.user.uid);
  const notiCheck = () => {
    const notiDB = realtime.ref(`noti/${user_id}`);
    notiDB.update({ read: true });
    props._onClick();
  };

  React.useEffect(() => {
    const notiDB = realtime.ref(`noti/${user_id}`);
    
    notiDB.on("value", (snapshot) => {

      setIsRead(snapshot.val().read);
    });
    return () => notiDB.off();
  }, []);
  return (
    <>
      <Badge color="secondary" variant="dot" invisible={is_read} onClick={notiCheck}>
        <NotificationIcon/>
      </Badge>
    </>
  )
}

NotiBadge.defaultProps = {
  _onClick : () => { },
}

export default NotiBadge
