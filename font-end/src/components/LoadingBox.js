import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

function LoadingBox() {
  return (
    <CircularProgress
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <span className="visually-hidden">Loading ....</span>{' '}
    </CircularProgress>
  );
}

export default LoadingBox;
