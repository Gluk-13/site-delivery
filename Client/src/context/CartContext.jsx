import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isCartLoading: action.payload };
    case 'SET_CART_DATA':
      return { 
        ...state, 
        cartData: action.payload.cartData,
        productsData: action.payload.productsData || state.productsData,
        isEmpty: action.payload.cartData.length === 0,
        isCartLoading: false,
        isInitialLoading: false,
        loadingItems: {},
        isError: null
      };
    case 'SET_ERROR':
      return { 
        ...state, 
        isCartLoading: false, 
        isInitialLoading: false,
        loadingItems: {},
        isError: action.payload
      };
    case 'CLEAR_ERROR':
      return { ...state, isError: null };
    case 'SET_ORDER_LOADING':
      return { ...state, isOrderLoading: action.payload };
    default:
      return state;
  }
};

const initialState = {
  cartData: [],
  productsData: [],
  loadingItems: {},
  isCartLoading: true,
  isOrderLoading: false, 
  isError: null,
  isEmpty: false,
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
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

  const createOrder = async (selectedItems = []) => {
    dispatch({ type: 'SET_ORDER_LOADING', payload: true });
    
    try {
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');

      const itemsToOrder = selectedItems.length > 0 
        ? selectedItems 
        : state.cartData.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }));

      const response = await fetch(`${API_BASE_URL}/orders/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          items: itemsToOrder
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Ошибка при создании заказа');
      }

      await fetchCart();
      
      return result;

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_ORDER_LOADING', payload: false });
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
    createOrder,
    isLoading: (productId) => state.loadingItems[productId] || false,
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