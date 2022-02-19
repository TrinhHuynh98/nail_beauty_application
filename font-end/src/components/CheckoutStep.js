import React from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';

const steps = ['Signin', 'Shipping', 'Payment', 'Place Order'];

function CheckoutStep() {
  return (
    <>
      <Stepper activeStep={1} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </>
  );
}
export default CheckoutStep;
