import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const useCartStore = create(
    persist(
        (set, get) => ({

        cartData: [],
        productsData: [],
        isCartLoading: true,
        isOrderLoading: false,
        isError: null,
        isEmpty: false,
        loadingItems: {},

        getCartItem: (productId) => {
            const { cartData } = get();
            return cartData.find(item => item.productId === productId);
        },
        
        fetchCart: async () => {
            try {
            set({ isCartLoading: true, isError: null });
            
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

            set({ 
                cartData: cartDataFromServer,
                productsData,
                isEmpty: cartDataFromServer.length === 0,
                isCartLoading: false,
                isError: null
            });

            } catch (error) {

            set({ 
                isError: error.message, 
                isCartLoading: false 
            });
            }
        },

        addToCart: async (productId, quantity = 1) => {
            try {
            set({ isCartLoading: true, isError: null });
            
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

            await get().fetchCart();
            
            } catch (error) {
            set({ 
                isError: error.message, 
                isCartLoading: false 
            });
            }
        },

        removeItemInCart: async (productId) => {
            try {
            set({ isCartLoading: true });
            
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Ошибка при удалении товара');

            await get().fetchCart();
            
            } catch (error) {
            set({ 
                isError: error.message, 
                isCartLoading: false 
            });
            }
        },

        createOrder: async (selectedItems = []) => {
            try {
            set({ isOrderLoading: true, isError: null });
            
            const { cartData, productsData } = get();
            const token = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');

            const itemsToOrder = selectedItems.length > 0 
                ? selectedItems 
                : cartData.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                }));

            const totalPrice = itemsToOrder.reduce((total, item) => {
                const product = productsData.find(p => p.id === item.productId);
                return total + (product?.price || 0) * item.quantity;
            }, 0);

            const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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
                })
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Ошибка при создании заказа');
            }

            await get().fetchCart();
            
            return result;

            } catch (error) {
            set({ isError: error.message });
            throw error;
            } finally {
            set({ isOrderLoading: false });
            }
        },

        clearError: () => set({ isError: null }),

        isLoading: (productId) => get().loadingItems[productId] || false,

        getTotalItems: () => {
            const { cartData } = get();
            return cartData.reduce((total, item) => total + item.quantity, 0);
        },

        getTotalPrice: () => {
            const { cartData, productsData } = get();
            return cartData.reduce((total, item) => {
            const product = productsData.find(p => p.id === item.productId);
            return total + (product?.price || 0) * item.quantity;
            }, 0);
        }


        }),
        {
        name: 'cart-storage',
        partialize: (state) => ({ 
            cartData: state.cartData,
            productsData: state.productsData
        })
        }
    )
);