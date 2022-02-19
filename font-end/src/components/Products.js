import React, { useContext } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActionArea,
  CardActions,
  Grid,
} from '@mui/material';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import { experimentalStyled as styled } from '@mui/material/styles';
import Rating from './Rating';
import { Store } from './Store';
import axios from 'axios';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function Products(props) {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  // const addCartHandler = async (item) => {
  //   const existItem = cartItems.find((x) => x.slug === product.slug);
  //   const quantity = existItem ? existItem.quantity + 1 : 1;
  //   const { data } = await axios.get(`/api/products/slug/${item.slug}`);
  //   if (data.countInStock < quantity) {
  //     window.alert('Sorry. Product is out of stock');
  //     return;
  //   }
  //   ctxDispatch({
  //     type: 'CART_ADD_ITEM',
  //     payload: { ...item, quantity },
  //   });
  // };
  const addCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/:_id/${item.id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };
  return (
    <>
      <Grid item xs={4} sm={4} md={4} style={{ marginTop: 20 }}>
        <Card sx={{ maxWidth: 345 }}>
          <CardActionArea>
            <Link to={`/product/${product.slug}`}>
              <CardMedia
                component="img"
                image={product.image}
                alt={product.name}
              />
            </Link>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.description}
              </Typography>
            </CardContent>
          </CardActionArea>

          <CardActions>
            <Rating rating={product.rating} numViews={product.numReviews} />
          </CardActions>
          {product.countInStock === 0 ? (
            <Button disabled size="small">
              Out of stock
            </Button>
          ) : (
            <Button onClick={() => addCartHandler(product)} size="small">
              Add to card
            </Button>
          )}

          <Item></Item>
        </Card>
      </Grid>
    </>
  );
}

export default Products;
