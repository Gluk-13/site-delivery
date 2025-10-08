// contexts/CartContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Редьюсер для управления состоянием корзины
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CART_DATA':
      return { 
        ...state, 
        cartData: action.payload.cartData,
        productsData: action.payload.productsData || state.productsData,
        isEmpty: action.payload.cartData.length === 0,
        isLoading: false
      };
    case 'SET_ERROR':
      return { ...state, isLoading: false, isError: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, isError: null };
    default:
      return state;
  }
};

const initialState = {
  cartData: [],
  productsData: [],
  isLoading: false,
  isCartLoading: true,
  isError: null,
  isEmpty: false,
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Ошибка при загрузке корзины');

      const cartDataFromServer = await response.json();

      const productIds = cartDataFromServer.map(item => item.productId);
      const productsResponse = await fetch(`${API_BASE_URL}/products/bulk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: productIds }),
      });

      let productsData = [];
      if (productsResponse.ok) {
        const result = await productsResponse.json();
        if (result.success) productsData = result.data;
      }

      dispatch({ 
        type: 'SET_CART_DATA', 
        payload: { cartData: cartDataFromServer, productsData } 
      });

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const removeItemInCart = async (productId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Ошибка при удалении товара');

      await fetchCart();
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');
      
      const response = await fetch(`${API_BASE_URL}/cart/items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, productId, quantity })
      });

      if (!response.ok) throw new Error('Ошибка при добавлении в корзину');

      await fetchCart();
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  useEffect(() => {
    fetchCart();
  }, []);

  const value = {
    ...state,
    addToCart,
    removeItemInCart,
    refetch: fetchCart,
    clearError,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};