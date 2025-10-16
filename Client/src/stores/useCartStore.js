import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const useCartStore = create(
    persist(
        (set, get) => ({
        
        cartData: [],
        productsData: [],
        isCartLoading: false,
        isOrderLoading: false,
        isError: null,
        isEmpty: false,
        loadingItems: {},

        setAddressDelivery: (data) => {
            set({ adressDelivery: data });
        },        

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
            set({ isCartLoading: false })
            
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