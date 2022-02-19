import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import {
  Grid,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Avatar,
  Button,
  FormControl,
} from '@mui/material';
import { Store } from './Store';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import { getError } from './utils';
import LoadingBox from './LoadingBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};
function PlaceOrderScreen() {
  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, cart } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0, 15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAdress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };
  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);

  return (
    <>
      <Helmet>
        <title>Place Order</title>
      </Helmet>
      <Header />
      <h1>Place Order</h1>
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
                    Name: {cart.shippingAdress.fullName}
                  </Typography>
                  <Typography gutterBottom variant="h5" component="div">
                    Adress: {cart.shippingAdress.address},{' '}
                    {cart.shippingAdress.city} ,{cart.shippingAdress.postalCode}
                    , {cart.shippingAdress.country}
                  </Typography>
                  <Link to="/shipping">Edit</Link>
                </CardContent>
              </CardActionArea>
            </Card>
            <Card sx={{ maxWidth: 345 }}>
              <Typography gutterBottom variant="h5" component="div">
                Cart Items
              </Typography>
              <CardActionArea>
                <CardContent>
                  {cart.cartItems.map((item) => (
                    <Grid container spacing={{ md: 3 }}>
                      <Grid item xs={6} sm={6} md={6}>
                        <Link to={`/product/${item.slug}`}>
                          <span>
                            <Avatar
                              sx={{ width: 100, height: 100 }}
                              src={item.image}
                              alt={item.name}
                            />
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                            >
                              {item.name}
                            </Typography>
                          </span>
                        </Link>
                      </Grid>

                      <Grid item xs={6} sm={6} md={6}>
                        <Typography gutterBottom variant="h5" component="div">
                          Price: $ {item.price}
                        </Typography>
                      </Grid>
                    </Grid>
                  ))}

                  <Link to="/cart">Edit</Link>
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
                      ${cart.itemsPrice}
                    </Grid>
                  </Grid>
                  <Grid container spacing={{ md: 3 }}>
                    <Grid item xs={6} sm={6} md={6}>
                      Shipping
                    </Grid>

                    <Grid item xs={6} sm={6} md={6}>
                      ${cart.shippingPrice}
                    </Grid>
                  </Grid>
                  <Grid container spacing={{ md: 3 }}>
                    <Grid item xs={6} sm={6} md={6}>
                      Tax
                    </Grid>

                    <Grid item xs={6} sm={6} md={6}>
                      ${cart.taxPrice}
                    </Grid>
                  </Grid>
                  <Grid container spacing={{ md: 3 }}>
                    <Grid item xs={6} sm={6} md={6}>
                      Order Total
                    </Grid>

                    <Grid item xs={6} sm={6} md={6}>
                      ${cart.totalPrice}
                    </Grid>
                  </Grid>
                  <FormControl style={{ marginTop: 20, marginBottom: 20 }}>
                    <Button
                      variant="outlined"
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems.length === 0}
                    >
                      Place Order
                    </Button>
                    {loading && <LoadingBox></LoadingBox>}
                  </FormControl>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default PlaceOrderScreen;
