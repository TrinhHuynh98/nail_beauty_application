import React, { useContext } from 'react';
import {
  Grid,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Button,
  Avatar,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Store } from './Store';
import Messagebox from './Messagebox';
import axios from 'axios';
import Header from '../components/Layout/Header';

function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/slug/${item.slug}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  const removeItemHandler = (item) => {
    ctxDispatch({
      type: 'CART_REMOVE_ITEM',
      payload: item,
    });
  };
  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };
  return (
    <>
      <div>
        <Helmet>
          <title>Shopping Cart</title>
        </Helmet>
        <Header />
        <h1>Shopping Cart</h1>
        <Box sx={{ flexGrow: 1, marginLeft: 10, marginRight: 10 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={8} sm={8} md={8} style={{ marginTop: 20 }}>
              {cartItems.length === 0 ? (
                <Messagebox>
                  Cart is empty. <Link to="/">Go Shopping</Link>
                </Messagebox>
              ) : (
                <ul>
                  {cartItems.map((item) => (
                    <Grid container spacing={{ md: 3 }}>
                      <Grid item xs={3} sm={3} md={3}>
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
                      <Grid item xs={3} sm={3} md={3}>
                        <span>
                          <Button
                            disabled={item.quantity === 1}
                            onClick={() =>
                              updateCartHandler(item, item.quantity - 1)
                            }
                          >
                            <i className="fas fa-minus-circle"></i>
                          </Button>
                        </span>
                        <span>{item.quantity}</span>
                        <span>
                          <Button
                            disabled={item.quantity === item.countInStock}
                            onClick={() =>
                              updateCartHandler(item, item.quantity + 1)
                            }
                          >
                            <i className="fas fa-plus-circle"></i>
                          </Button>
                        </span>
                      </Grid>
                      <Grid item xs={3} sm={3} md={3}>
                        <Typography gutterBottom variant="h5" component="div">
                          Price: $ {item.price}
                        </Typography>
                      </Grid>
                      <Grid item xs={2} sm={2} md={2}>
                        <Button onClick={() => removeItemHandler(item)}>
                          <i className="fas fa-trash"></i>
                        </Button>
                      </Grid>
                    </Grid>
                  ))}
                </ul>
              )}
            </Grid>

            <Grid item xs={4} sm={4} md={4} style={{ marginTop: 20 }}>
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}
                      {''} item : ${' '}
                      {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)})
                    </Typography>
                  </CardContent>
                </CardActionArea>

                <Button
                  disabled={cartItems.length === 0}
                  size="small"
                  onClick={() => checkoutHandler()}
                >
                  Process to Checkout
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </div>
    </>
  );
}

export default CartScreen;
