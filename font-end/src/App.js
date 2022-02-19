import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './components/HomeScreen';
import ServiceScreen from './components/ServiceScreen';
import ProductDetail from './components/ProductDetail';

import CartScreen from './components/CartScreen';
import SignInScreen from './components/SignInScreen';

import ShippingAddressScreen from './components/ShippingAddressScreen';
import SignUpScreen from './components/SignUpScreen';
import PaymentMethodScreen from './components/PaymentMethodScreen';
import PlaceOrderScreen from './components/PlaceOrderScreen';
import './App.css';
import OrderScreen from './components/OrderScreen';

function App() {
  return (
    <>
      <ToastContainer position="bottom-center" limit={1} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/signin" element={<SignInScreen />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/service" element={<ServiceScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/shipping" element={<ShippingAddressScreen />} />
          <Route path="/signup" element={<SignUpScreen />} />
          <Route path="/payment" element={<PaymentMethodScreen />} />
          <Route path="/placeorder" element={<PlaceOrderScreen />} />
          <Route path="/order/:id" element={<OrderScreen />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
