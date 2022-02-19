import React from 'react';
import {
  Button,
  FormControlLabel,
  TextField,
  Checkbox,
  Grid,
  Box,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function Login() {
  return (
    <>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1>Login screen</h1>
    </>
  );
}
export default Login;
