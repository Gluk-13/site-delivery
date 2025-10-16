import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const useOrdersStore = create(
    persist(
        (set, get) => ({

        locationDelivery: {},
        ordersData: [],
        productsData: [],
        isOrdersLoading: true,
        isStatusLoading: false,
        isOrdersError: null,
        isEmptyOrder: false,

        setAddressDelivery: (data) => {
            set({ locationDelivery: data });
        },

        fetchOrders: async () => {
            try {
            set({ isOrdersLoading: true, isOrdersError: null });
            
            const token = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');
            
            const response = await fetch(`${API_BASE_URL}/orders/${userId}`, {
                method: 'GET',
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Ошибка при загрузке заказов');

            const ordersDataFromServer = await response.json();

            if (!ordersDataFromServer.success) {
                throw new Error(ordersDataFromServer.message || 'Ошибка при получении заказов');
            }
            
            let ordersData = ordersDataFromServer.data || [];
                
                const ordersWithItems = await Promise.all(
                    ordersData.map(async (order) => {
                        const itemsResponse = await fetch(`${API_BASE_URL}/orders/${order.id}/items`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        });

                        let orderItems = [];
                        if (itemsResponse.ok) {
                            const itemsResult = await itemsResponse.json();
                            if (itemsResult.success) orderItems = itemsResult.data;
                        }

                        const productIds = orderItems.map(item => item.product_id);
                        let productsInfo = [];
                        
                        if (productIds.length > 0) {
                            const productsResponse = await fetch(`${API_BASE_URL}/products/bulk`, {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ ids: productIds }),
                            });

                            if (productsResponse.ok) {
                                const result = await productsResponse.json();
                                if (result.success) productsInfo = result.data;
                            }
                        }

                        return {
                            ...order,
                            items: orderItems,
                            productsInfo
                        };
                    })
                );

                set({ 
                    ordersData: ordersWithItems,
                    isEmptyOrder: ordersWithItems.length === 0,
                    isOrdersLoading: false,
                    isOrdersError: null
                });

            } catch (error) {
                set({ 
                    isOrdersError: error.message, 
                    isOrdersLoading: false 
                });
            }
        },

        createOrder: async ( cartItems, addressDelivery, comment = '' ) => {
            try {
            set({ isOrdersLoading: true, isError: null });
            
            const token = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');

            const itemsToOrder = cartItems.length > 0 
                ? cartItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.product.price,
                })) : [];
            console.log(cartItems)
            console.log('Items to order:', itemsToOrder);
            const totalPrice = itemsToOrder.reduce((total, item) => {
                return total + item.price * item.quantity;
            }, 0);

            const orderNumber = `ORD-${Date.now()}-${userId}-${Math.random().toString(36).substr(2, 9)}`;

            const response = await fetch(`${API_BASE_URL}/orders/create/${userId}`, {
                method: 'POST',
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                items: itemsToOrder,
                totalPrice: totalPrice,
                orderNumber: orderNumber,
                deliveryAddress: addressDelivery,
                comment: comment
                })
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Ошибка при создании заказа');
            }

            await get().fetchOrders()
            
            return result;

            } catch (error) {
                set({ isError: error.message });
                throw error;
            } finally {
                set({ isOrdersLoading: false, isCartLoading: false });
            }
        },

        updateOrderStatus: async (orderId, status) => {
            set({ isStatusLoading: true, isOrdersError: null });

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

            set(state => ({
                ordersData: state.ordersData.map(order =>
                order.id === orderId
                    ? { ...order, status: status }
                    : order
                ),
                isStatusLoading: false
            }));

            return result;

            } catch (error) {
            set({ 
                isOrdersError: error.message,
                isStatusLoading: false 
            });
            throw error;
            }
        },

        addOrder: (orderData) => {
            set(state => ({
            ordersData: [orderData, ...state.ordersData],
            isEmptyOrder: false
            }));
        },

        clearError: () => set({ isOrdersError: null }),

        getOrderById: (orderId) => {
            const { ordersData } = get();
            return ordersData.find(order => order.id === orderId);
        },

        getOrdersByStatus: (status) => {
            const { ordersData } = get();
            return ordersData.filter(order => order.status === status);
        },

        getTotalOrders: () => {
            const { ordersData } = get();
            return ordersData.length;
        },

        getOrdersWithProducts: () => {
            const { ordersData } = get();
            return ordersData.filter(order => order.productsInfo && order.productsInfo.length > 0);
        }
        }),
        {
        name: 'orders-storage',
        partialize: (state) => ({
            ordersData: state.ordersData,
            productsData: state.productsData
        })
        }
    )
);