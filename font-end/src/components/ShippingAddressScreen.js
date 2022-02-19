import React, { useState, useContext, useEffect } from 'react';
import {
  FormControl,
  TextField,
  Grid,
  Typography,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Store } from './Store';
import Header from './Layout/Header';
import CheckoutStep from './CheckoutStep';

function ShippingAddressScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAdress },
  } = state;
  const [fullName, setFullName] = useState(shippingAdress.fullName || '');
  const [address, setAddress] = useState(shippingAdress.address || '');
  const [city, setCity] = useState(shippingAdress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAdress.postalCode || '');
  const [country, setCountry] = useState(shippingAdress.country || '');

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  });

  const shippingHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADRESS',
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
      },
    });
    localStorage.setItem(
      'shippingAdress',
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
      })
    );
    navigate('/payment');
  };

  return (
    <>
      <Helmet>
        <title>Shipping</title>
      </Helmet>
      <Header />
      <CheckoutStep />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '30vh' }}
      >
        <Typography component="h1" variant="h5" style={{ marginTop: 20 }}>
          Shipping
        </Typography>
        <FormControl style={{ marginTop: 20, marginBottom: 20 }}>
          <TextField
            required
            id="standard-required"
            label="Full Name"
            defaultValue={fullName}
            variant="outlined"
            onChange={(e) => {
              setFullName(e.target.value);
            }}
          />
        </FormControl>
        <FormControl style={{ marginTop: 20, marginBottom: 20 }}>
          <TextField
            required
            id="standard-required"
            label="Adress"
            defaultValue={address}
            variant="outlined"
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />
        </FormControl>
        <FormControl style={{ marginTop: 20, marginBottom: 20 }}>
          <TextField
            required
            id="standard-required"
            label="City"
            defaultValue={city}
            variant="outlined"
            onChange={(e) => {
              setCity(e.target.value);
            }}
          />
        </FormControl>
        <FormControl style={{ marginTop: 20, marginBottom: 20 }}>
          <TextField
            required
            id="standard-required"
            label="Postal Code"
            defaultValue={postalCode}
            variant="outlined"
            onChange={(e) => {
              setPostalCode(e.target.value);
            }}
          />
        </FormControl>
        <FormControl style={{ marginTop: 20, marginBottom: 20 }}>
          <TextField
            required
            id="standard-required"
            label="Country"
            defaultValue={country}
            variant="outlined"
            onChange={(e) => {
              setCountry(e.target.value);
            }}
          />
        </FormControl>
        <FormControl style={{ marginTop: 20, marginBottom: 20 }}>
          <Button variant="outlined" onClick={shippingHandler}>
            Continue
          </Button>
        </FormControl>
      </Grid>
    </>
  );
}
export default ShippingAddressScreen;
