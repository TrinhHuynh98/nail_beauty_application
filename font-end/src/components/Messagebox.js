import React from 'react';
import Alert from '@mui/material/Alert';

function Messagebox(props) {
  console.log('props childrent', props.children);
  return <Alert severity="error"> {props.children}</Alert>;
}

export default Messagebox;
