import React, { useContext, useEffect, useReducer } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import Messagebox from './Messagebox';
import LoadingBox from './LoadingBox';
import { useNavigate, useParams } from 'react-router-dom';
import { Store } from './Store';
import axios from 'axios';
import Header from './Layout/Header';
import { Helmet } from 'react-helmet-async';
import {
  Grid,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@mui/material';
import { getError } from './utils';
import { toast } from 'react-toastify';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };
    default:
      return state;
  }
}

function OrderScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { id: orderId } = params;
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, order, successPay, loadingPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: '',
      successPay: false,
      loadingPay: false,
    });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('Order is paid');
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }

  function onError(err) {
    toast.error(getError(err));
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (!userInfo) {
      return navigate('/login');
    }

    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [order, userInfo, orderId, navigate, paypalDispatch, successPay]);

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <Messagebox variant="danger">{error}</Messagebox>
  ) : (
    <>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <Header />
      <h1>Order {orderId}</h1>
      <Box sx={{ flexGrow: 1, marginLeft: 10, marginRight: 10 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          <Grid item xs={8} sm={8} md={8} style={{ marginTop: 20 }}>
            <Card sx={{ maxWidth: 345 }}>
              <Typography gutterBottom variant="h5" component="div">
                Shipping
              </Typography>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Name: {order.shippingAddress.fullName}
                  </Typography>
                  <Typography gutterBottom variant="h5" component="div">
                    Adress: {order.shippingAddress.address},{' '}
                    {order.shippingAddress.city} ,
                    {order.shippingAddress.postalCode},{' '}
                    {order.shippingAddress.country}
                  </Typography>
                  {order.isDelivered ? (
                    <Messagebox variant="danger">
                      Delivered at {order.deliveredAt}
                    </Messagebox>
                  ) : (
                    <Messagebox variant="danger">Not Delivered</Messagebox>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
            <Card sx={{ maxWidth: 345 }}>
              <Typography gutterBottom variant="h5" component="div">
                Payment
              </Typography>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Method: {order.paymentMethod}
                  </Typography>
                  {order.isPaid ? (
                    <Messagebox variant="danger">
                      Paid at {order.paidAt}
                    </Messagebox>
                  ) : (
                    <Messagebox variant="danger">Not Paid</Messagebox>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          <Grid item xs={4} sm={4} md={4} style={{ marginTop: 20 }}>
            <Typography gutterBottom variant="h5" component="div">
              Order Sumary
            </Typography>
            <Card sx={{ maxWidth: 345 }}>
              <Typography gutterBottom variant="h5" component="div">
                Items
              </Typography>
              <CardActionArea>
                <CardContent>
                  <Grid container spacing={{ md: 3 }}>
                    <Grid item xs={6} sm={6} md={6}>
                      Items
                    </Grid>

                    <Grid item xs={6} sm={6} md={6}>
                      ${order.itemPrice}
                    </Grid>
                  </Grid>

                  <Grid container spacing={{ md: 3 }}>
                    <Grid item xs={6} sm={6} md={6}>
                      Shipping
                    </Grid>

                    <Grid item xs={6} sm={6} md={6}>
                      ${order.shippingPrice}
                    </Grid>

                    <Grid container spacing={{ md: 3 }}>
                      <Grid item xs={6} sm={6} md={6}>
                        Tax
                      </Grid>

                      <Grid item xs={6} sm={6} md={6}>
                        ${order.taxPrice}
                      </Grid>
                    </Grid>

                    <Grid container spacing={{ md: 3 }}>
                      <Grid item xs={6} sm={6} md={6}>
                        Total Price
                      </Grid>

                      <Grid item xs={6} sm={6} md={6}>
                        ${order.totalPrice}
                      </Grid>
                    </Grid>

                    {!order.isPaid && (
                      <Grid container spacing={{ md: 3 }}>
                        <Grid item xs={6} sm={6} md={6}>
                          {isPending ? (
                            <LoadingBox />
                          ) : (
                            <>
                              <PayPalButtons
                                createOrder={createOrder}
                                onApprove={onApprove}
                                onError={onError}
                              ></PayPalButtons>
                            </>
                          )}
                          {loadingPay && <LoadingBox></LoadingBox>}
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default OrderScreen;
