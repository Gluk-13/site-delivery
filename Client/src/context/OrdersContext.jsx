import React, { createContext, useContext, useReducer, useEffect } from 'react';

const OrdersContext = createContext();

const ordersReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isOrdersLoading: action.payload };
    case 'SET_ORDERS_DATA':
      return { 
        ...state, 
        ordersData: action.payload.ordersData,
        productsData: action.payload.productsData || state.productsData,
        isEmpty: action.payload.ordersData.length === 0,
        isOrdersLoading: false,
        isInitialLoading: false,
        isError: null
      };
    case 'SET_ERROR':
      return { 
        ...state, 
        isOrdersLoading: false, 
        isInitialLoading: false,
        isError: action.payload
      };
    case 'CLEAR_ERROR':
      return { ...state, isError: null };
    case 'SET_STATUS_LOADING':
      return { ...state, isStatusLoading: action.payload };
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        ordersData: state.ordersData.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        )
      };
    case 'ADD_ORDER':
      return {
        ...state,
        ordersData: [action.payload, ...state.ordersData],
        isEmpty: false
      };
    default:
      return state;
  }
};

const initialState = {
  ordersData: [],
  productsData: [],
  isOrdersLoading: true,
  isStatusLoading: false,
  isError: null,
  isEmpty: false,
};

export const OrdersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ordersReducer, initialState);
  const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

    const fetchOrders = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const token = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');
            
            const response = await fetch(`${API_BASE_URL}/orders/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            });

            if (!response.ok) throw new Error('Ошибка при загрузке заказов');

            const ordersDataFromServer = await response.json();

            if (!ordersDataFromServer.success) {
            throw new Error(ordersDataFromServer.message || 'Ошибка при получении заказов');
            }

            let ordersData = ordersDataFromServer.data || [];

            const ordersWithProducts = await Promise.all(
            ordersData.map(async (order) => {
                if (!order.items || order.items.length === 0) {
                return { ...order, productsInfo: [] };
                }

                const productIds = order.items.map(item => item.product_id);
                
                const productsResponse = await fetch(`${API_BASE_URL}/products/bulk`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: productIds }),
                });

                let productsInfo = [];
                if (productsResponse.ok) {
                const result = await productsResponse.json();
                if (result.success) productsInfo = result.data;
                }

                return {
                ...order,
                productsInfo
                };
            })
            );

            dispatch({ 
            type: 'SET_ORDERS_DATA', 
            payload: { ordersData: ordersWithProducts } 
            });

        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        dispatch({ type: 'SET_STATUS_LOADING', payload: true });
    
        try {
            const token = localStorage.getItem('authToken');
            
            const response = await fetch(`${API_BASE_URL}/orders/status/${orderId}`, {
                method: 'PATCH',
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status })
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Ошибка при обновлении статуса заказа');
            }

            dispatch({ 
                type: 'UPDATE_ORDER_STATUS', 
                payload: { orderId, status } 
            });

            return result;

        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
            throw error;
        } finally {
            dispatch({ type: 'SET_STATUS_LOADING', payload: false });
        }
    };

  const addOrder = (orderData) => {
    dispatch({ type: 'ADD_ORDER', payload: orderData });
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const value = {
    ...state,
    fetchOrders,
    updateOrderStatus,
    addOrder,
    clearError,
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};