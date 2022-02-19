import React, { useEffect, useReducer, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Grid,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Chip,
  Button,
} from '@mui/material';
import Rating from './Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from './LoadingBox';
import Messagebox from './Messagebox';
import { getError } from './utils';
import { Store } from './Store';
import Header from '../components/Layout/Header';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FEATCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const { slug } = params;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FEATCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/slug/${slug}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    navigate('/cart');
  };

  console.log('state', state);

  return loading ? (
    <>
      {' '}
      <Header />
      <LoadingBox />
    </>
  ) : error ? (
    <>
      <Header />
      <Messagebox variant="error">{error}</Messagebox>
    </>
  ) : (
    <div>
      <Helmet>
        <title>{product.name}</title>
      </Helmet>
      <Header />
      <Box sx={{ flexGrow: 1, marginLeft: 10, marginRight: 10 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          <Grid item xs={4} sm={4} md={4} style={{ marginTop: 20 }}>
            <img
              className="img-large"
              src={product.image}
              alt={product.name}
            ></img>
          </Grid>
          <Grid item xs={4} sm={4} md={4} style={{ marginTop: 20 }}>
            <h1>{product.name}</h1>

            <Rating rating={product.rating} numViews={product.numReviews} />

            <p>Price: ${product.price}</p>
          </Grid>

          <Grid item xs={4} sm={4} md={4} style={{ marginTop: 20 }}>
            <Card sx={{ maxWidth: 345 }}>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Price: ${product.price}
                  </Typography>
                  <Typography gutterBottom variant="h5" component="div">
                    Status:{' '}
                    {product.countInStock > 0 ? (
                      <Chip label="In Stock" color="success" />
                    ) : (
                      <Chip label="Unavialable" color="primary" />
                    )}
                  </Typography>
                </CardContent>
              </CardActionArea>

              {product.countInStock > 0 && (
                <Button size="small" onClick={addToCartHandler}>
                  Add to card
                </Button>
              )}
            </Card>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default ProductDetail;
