import React, { useState, useEffect } from 'react';

export const useCart = () => {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('authToken');
  const [isLoading, setIsLoading] = useState(true);
  const [cartData, setCartData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [cartItemIds, setCartItemIds] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
  
  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart?userId=${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке корзины');
      }

      const cartDataFromServer = await response.json();
      setCartData(cartDataFromServer);
      setIsEmpty(cartDataFromServer.length === 0);
      setCartItemIds(cartDataFromServer.map(item => item.productId));

      if (cartDataFromServer.length > 0) {
        await fetchProducts(cartDataFromServer);
      }

      setIsLoading(false);
    } catch (error) {
      setCartData([]);
      setIsEmpty(true);
      console.error('Ошибка при получении данных корзины', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async (cartItemsFromServer) => {
    try {
      const productIds = cartItemsFromServer.map(item => item.productId);
      const response = await fetch(`${API_BASE_URL}/products/bulk`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: productIds }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке товаров');
      }

      const result = await response.json();
      if (result.success) {
        setProductsData(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Ошибка при получении товаров', error);
      setProductsData([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    isLoading,
    cartData,
    productsData,
    isEmpty,
    cartItemIds,
    refetch: fetchCart,
  };
};