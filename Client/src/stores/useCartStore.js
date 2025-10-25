import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './useAuthStore';

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
                const token = useAuthStore.getState().token;

                const response = await useAuthStore.getState().fetchWithAuth(`${API_BASE_URL}/cart`, {
                    method: 'GET',
                    headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) throw new Error('Ошибка при загрузке корзины');

                const cartDataFromServer = await response.json();

                const productIds = cartDataFromServer.map(item => item.productId);
                const productsResponse = await useAuthStore.getState().fetchWithAuth(`${API_BASE_URL}/products/bulk`, {
                    method: 'POST',
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
            
            const token = useAuthStore.getState().token;
            const userId = useAuthStore.getState().user?.id;

            if (!token || !userId) {
                set({ isCartLoading: false, isError: 'Вы не авторизованы' });
                return
            }
            
            const response = await useAuthStore.getState().fetchWithAuth(`${API_BASE_URL}/cart/items`, {
                method: 'POST',
                body: JSON.stringify({ productId, quantity })
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
            const response = await useAuthStore.getState().fetchWithAuth(`${API_BASE_URL}/cart/items/${productId}`, {
                method: 'DELETE',
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
        },

        clearCart: async () => {
            set({ cartData: [], isCartLoading: false })
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