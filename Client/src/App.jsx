import { useState } from 'react'
import { BrowserRouter, Routes, Route, Outlet, Router } from 'react-router-dom'
import Header from './components/Header/Header'
import Delivery from './components/Delivery/Delivery'
import HomePage from './components/HomePage/HomePage'
import Footer from './components/Footer/Footer'
import Authorization from './components/Authorization/Authorization'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import ProfilePage from './components/ProfilePage/ProfilePage'
import CartPage from './components/ProfilePage/components/CartPage/CartPage'
import DeliveryHistory from './components/ProfilePage/components/DeliveryHistory/DeliveryHistory'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Authorization />} />

        <Route path="/" element={
          <ProtectedRoute>
            <div className="app-layout">
              <Header />
              <Delivery />
              <Outlet />
              <Footer />
            </div>
          </ProtectedRoute>
        }>
          <Route index element={<HomePage />} /> 
          <Route path="profile" element={<ProfilePage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="delivery-history" element={<DeliveryHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
