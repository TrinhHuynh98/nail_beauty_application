import React, { useContext, useEffect, useState } from 'react';
import {
  FormControl,
  TextField,
  Grid,
  Typography,
  Button,
} from '@mui/material';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Helmet } from 'react-helmet-async';
import { Store } from './Store';
import { toast } from 'react-toastify';
import { getError } from './utils';

function SignInScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectUrl ? redirectUrl : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('api/users/signin', {
        email,
        password,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  return (
    <>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '30vh' }}
      >
        <Typography component="h1" variant="h5" style={{ marginTop: 20 }}>
          Sign in
        </Typography>
        <FormControl style={{ marginTop: 20, marginBottom: 20 }}>
          <TextField
            required
            id="standard-required"
            label="Email"
            defaultValue="Your Email"
            variant="standard"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </FormControl>
        <FormControl style={{ marginTop: 20, marginBottom: 20 }}>
          <TextField
            id="standard-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            variant="standard"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </FormControl>
        <FormControl style={{ marginTop: 20, marginBottom: 20 }}>
          <Button
            variant="outlined"
            onClick={submitHandler}
            //onSubmit={submitHandler}
          >
            Sign In
          </Button>
        </FormControl>
        <Link to={`/register?redirect=${redirect}`}>Create new account</Link>
      </Grid>
    </>
  );
}
export default SignInScreen;
