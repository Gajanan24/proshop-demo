import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider, BrowserRouter, Routes, Link
} from "react-router-dom"
// import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/index.css';
import './assets/styles/bootstrap.custom.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/cartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/registerScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/orderScreen';
import ProfileScreen from './screens/ProfileScreen';

import OrderListScreen from './screens/Admin/OrderListScreen';
import ProductListScreen from './screens/Admin/ProductListScreen';
import ProductEditScreen from './screens/Admin/ProductEditScreen';
import UserListScreen from './screens/Admin/UserListScreen';
import UserEditScreen from './screens/Admin/UserEditScreen';


/*
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
        <Route index={true} path='/' element={<HomeScreen/>} />
        <Route path='/product/:id' element={<ProductScreen/>} />
    </Route>
  )
)
*/

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <RouterProvider router={router}/> */}
    <Provider store={store}>

   
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomeScreen />} />
          <Route path="/search/:keyword" element={<HomeScreen />} />
          <Route path="/page/:pageNumber" element={<HomeScreen />} />
          <Route path="/search/:keyword/page/:pageNumber" element={<HomeScreen />} />
          <Route path="/product/:id" element={<ProductScreen />} />
          <Route path="/cart" element={<CartScreen/>} />
          <Route path="/login" element={<LoginScreen/>} />
          <Route path="/register" element={<RegisterScreen/>} />
          <Route path='' element={<PrivateRoute/>}>
               <Route path="/shipping" element={<ShippingScreen/>} />
               <Route path="/payment" element={<PaymentScreen/>} />
               <Route path="/placeorder" element={<PlaceOrderScreen/>} />
               <Route path="/order/:id" element={<OrderScreen/>} />
               <Route path="/profile" element={<ProfileScreen/>} />

          </Route>
          <Route path='' element={<AdminRoute/>}>
                <Route path="/admin/orderlist" element={<OrderListScreen/>} /> 
                <Route path="/admin/productlist" element={<ProductListScreen/>} />
                <Route path="/admin/productlist/:pageNumber" element={<ProductListScreen/>} />
                <Route path="/admin/product/:id/edit" element={<ProductEditScreen/>} />  
                <Route path="/admin/userlist" element={<UserListScreen/>} />
                <Route path="/admin/user/:id/edit" element={<UserEditScreen/>} />          
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
