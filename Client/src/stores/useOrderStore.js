import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './useAuthStore';

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
            adminOrders: [],

            setAddressDelivery: (data) => {
                set({ locationDelivery: data });
            },

            fetchAdminOrders: async (filters = {}) => {
                try {
                    set({ isOrdersLoading: true, isOrdersError: null });

                    const response = await useAuthStore.getState().fetchWithAuth(`${API_BASE_URL}/orders/admin`);
                    
                    if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

                    const result = await response.json();
                    const orders = result.orders || result.data || result || [];

                    const ordersWithItems = await Promise.all(
                        orders.map(async (order) => {
                            try {
                                const itemsResponse = await useAuthStore.getState().fetchWithAuth(
                                    `${API_BASE_URL}/orders/${order.id}/items`
                                );
                                
                                let orderItems = [];
                                if (itemsResponse.ok) {
                                    const itemsResult = await itemsResponse.json();
                                    orderItems = itemsResult.items || itemsResult.data || [];
                                }
                                const productIds = orderItems.map(item => item.product_id);
                                let productsInfo = [];
                                
                                if (productIds.length > 0) {
                                    const productsResponse = await useAuthStore.getState().fetchWithAuth(
                                        `${API_BASE_URL}/products/bulk`,
                                        {
                                            method: 'POST',
                                            body: JSON.stringify({ ids: productIds }),
                                        }
                                    );

                                    if (productsResponse.ok) {
                                        const productsResult = await productsResponse.json();
                                        productsInfo = productsResult.products || productsResult.data || [];
                                    }
                                }

                                return {
                                    ...order,
                                    items: orderItems,
                                    productsInfo
                                };
                            } catch (error) {
                                console.error(`Error loading items for order ${order.id}:`, error);
                                return order;
                            }
                        })
                    );

                    set({
                        adminOrders: ordersWithItems,
                        isOrdersLoading: false, 
                        isOrdersError: null
                    });

                    return ordersWithItems;

                } catch (error) {
                    console.error('❌ Fetch error:', error);
                    set({
                        isOrdersLoading: false, 
                        adminOrders: [], 
                        isOrdersError: error.message
                    });
                    throw error;
                }
            },

            fetchOrders: async () => {
                try {
                set({ isOrdersLoading: true, isOrdersError: null });
                
                const token = useAuthStore.getState().token;
                const userId = useAuthStore.getState().user?.id;
                

                if (!token || !userId) {
                    set({ 
                        ordersData: [], 
                        isOrdersLoading: false,
                        isEmptyOrder: true 
                    });
                    return;
                }
                
                const response = await useAuthStore.getState().fetchWithAuth(`${API_BASE_URL}/orders`);

                if (!response.ok) throw new Error('Ошибка при загрузке заказов');

                const ordersDataFromServer = await response.json();

                if (!ordersDataFromServer.success) {
                    throw new Error(ordersDataFromServer.message || 'Ошибка при получении заказов');
                }
                
                let ordersData = ordersDataFromServer.data || [];
                    
                    const ordersWithItems = await Promise.all(
                        ordersData.map(async (order) => {
                            const itemsResponse = await useAuthStore.getState().fetchWithAuth(`${API_BASE_URL}/orders/${order.id}/items`);

                            let orderItems = [];
                            if (itemsResponse.ok) {
                                const itemsResult = await itemsResponse.json();
                                if (itemsResult.success) orderItems = itemsResult.data;
                            }

                            const productIds = orderItems.map(item => item.product_id);
                            let productsInfo = [];
                            
                            if (productIds.length > 0) {
                                const productsResponse = await useAuthStore.getState().fetchWithAuth(`${API_BASE_URL}/products/bulk`, {
                                    method: 'POST',
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
                const userId = useAuthStore.getState().user?.id;

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

                const response = await useAuthStore.getState().fetchWithAuth(`${API_BASE_URL}/orders/create/`, {
                    method: 'POST',
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
                const token = useAuthStore.getState().token;
                
                const response = await useAuthStore.getState().fetchWithAuth(`${API_BASE_URL}/orders/status/${orderId}`, {
                    method: 'PATCH',
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
            },

            clearOrders: () => {
                set({ ordersData: [], isLoading: false });
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