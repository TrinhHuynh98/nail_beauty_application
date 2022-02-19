import axios from 'axios';
import React, { useEffect, useReducer } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Products from './Products';
import { Helmet } from 'react-helmet-async';
import LoadingBox from './LoadingBox';
import Messagebox from './Messagebox';
import Header from '../components/Layout/Header';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, dataProduct: action.payload, loading: false };
    case 'FEATCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, dataProduct }, dispatch] = useReducer(reducer, {
    dataProduct: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FEATCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  console.log('dataProduct', dataProduct);

  return (
    <>
      <Helmet>
        <title>NAILBEAUTY</title>
      </Helmet>
      <Header />
      <Box sx={{ flexGrow: 1, marginLeft: 10, marginRight: 10 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {loading ? (
            <LoadingBox
              style={{
                flexDirection: 'column',
                alignItems: 'center',
              }}
            />
          ) : error ? (
            <Messagebox variant="danger">{error}</Messagebox>
          ) : (
            dataProduct.map((item) => <Products product={item}></Products>)
          )}
        </Grid>
      </Box>
    </>
  );
}
export default HomeScreen;
