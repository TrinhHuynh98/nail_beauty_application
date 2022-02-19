import React, { useState, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CheckoutStep from './CheckoutStep';
import { Store } from './Store';

import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Grid,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAdress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethodName] = useState(
    paymentMethod || 'PayPal'
  );

  useEffect(() => {
    if (!shippingAdress.address) {
      navigate('/shipping');
    }
  }, [shippingAdress, navigate]);

  const paymentMethodHandler = () => {
    ctxDispatch({
      type: 'SAVE_PAYMENT_METHOD',
      payload: paymentMethodName,
    });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeorder');
  };

  return (
    <>
      <Helmet>
        <title>Payment Methods</title>
      </Helmet>
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

        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">
            Payment method
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={paymentMethodName}
            onChange={(e) => setPaymentMethodName(e.target.value)}
          >
            <FormControlLabel
              value="PayPal"
              control={<Radio />}
              label="PayPal"
            />
            <FormControlLabel value="Order" control={<Radio />} label="Other" />
          </RadioGroup>
          <Button variant="outlined" onClick={paymentMethodHandler}>
            Continue
          </Button>
        </FormControl>
      </Grid>
    </>
  );
}
