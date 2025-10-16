import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Outlet, Router, useLocation } from 'react-router-dom'
import Header from './components/Header/Header'
import Delivery from './components/Delivery/Delivery'
import HomePage from './components/HomePage/HomePage'
import Footer from './components/Footer/Footer'
import Authorization from './components/Authorization/Authorization'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import ProfilePage from './components/ProfilePage/ProfilePage'
import CartPage from './components/CartPage/CartPage'
import DeliveryHistory from './components/ProfilePage/components/DeliveryHistory/DeliveryHistory'
import MainPage from './components/MainPage/MainPage'
import Sale from './components/HomePage/section/SaleProductSection/Sale'
import NewProduct from './components/HomePage/section/NewProduct/NewProduct'
import FavoritePage from './components/Favorite/FavoritePage'
import Orders from './components/Orders/Orders'

function AppLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="app-layout">
      <Header/>
      {isHomePage && <Delivery/>}
      <ProtectedRoute>
        <MainPage/>
      </ProtectedRoute>
      <Footer/>
    </div>
  ) 
}

function App() {

  return (
        <BrowserRouter>
          <Routes>
            <Route path="login" element={<Authorization />} />

            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout/>
              </ProtectedRoute>
            }>
              <Route index element={<HomePage />} /> 
              <Route path="profile" element={<ProfilePage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="delivery-history" element={<DeliveryHistory />} />
              <Route path='sale' element={<Sale/>} />
              <Route path='new-product' element={<NewProduct/>} />
              <Route path='favorite' element={<FavoritePage/>} />
              <Route path='orders' element={<Orders/>} />
            </Route>
          </Routes>
        </BrowserRouter>
  );
}

export default App
