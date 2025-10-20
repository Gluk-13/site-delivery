import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './useAuthStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const useFavoriteStore = create(
    persist(
        (set, get) => ({

            favorites: [],
            isFavoriteLoading: false,
            isFavoriteError: null,

            loadFavorites: async () => {
                try {
                    set({ isFavoriteLoading: true, isFavoriteError: null})

                    const token = useAuthStore.getState().token;
                    const response = await fetch(`${API_BASE_URL}/favorites`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        set({
                            favorites: data || [],
                            isFavoriteLoading: false,
                            isFavoriteError: null
                        });
                    } else {
                        set({ 
                            favorites: [], 
                            isFavoriteLoading: false,
                            isFavoriteError: 'Ошибка при получении избранного'
                        });
                    }
                } catch (error) {
                    set({
                        isFavoriteLoading: false,
                        isFavoriteError: error.message
                    })
                }
            },

            addToFavorites: async (productId) => {
                try {
                    set({ isFavoriteError: null, isFavoriteLoading: true })
                    const token = useAuthStore.getState().token;

                    if (!token) {
                        set({ isFavoriteLoading: false, isFavoriteError:'Вы не авторизованы'})
                        return
                    }

                    const response = await fetch(`${API_BASE_URL}/favorites/items`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ productId })
                    });
                    if(response.ok) {
                        const updatedFavorites = await response.json()
                        set({ favorites: updatedFavorites })
                    } else {
                        set({ 
                            isFavoriteError: `Неожиданный ответ от сервера:${response.status}`,
                            isFavoriteLoading: false
                        })
                    }
                } catch (error) {
                    set({ 
                        isFavoriteError: error.message,
                        isFavoriteLoading: false
                     })
                }
            },

            removeFromFavorites: async (productId) => {
                try {
                    set({ isFavoriteLoading: true, isFavoriteError: null })
                    const token = useAuthStore.getState().token;
                    const response = await fetch(`${API_BASE_URL}/favorites/items/${productId}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.ok) {
                        const updatedFavorites = await response.json();
                        set({ favorites: updatedFavorites })
                    } else {
                        set({ 
                            isFavoriteError: `Неожиданный ответ от сервера:${response.status}`,
                            isFavoriteLoading: false
                        })
                    }

                } catch (error) {
                    set({ 
                        isFavoriteError: error.message,
                        isFavoriteLoading: false
                     })
                }
            },

            isInFavorites: (productId) => {
                const { favorites } = get();
                return Array.isArray(favorites) && favorites.includes(productId);
            },

            getFavoritesCount: () => {
                const { favorites } = get();
                return Array.isArray(favorites) ? favorites.length : 0;
            },

            clearFavorites: () => {
                set({ favorites: [], isFavoriteLoading: false })
            }
        }),
        {
            name: 'favorites-storage',
            partialize: (state) => ({
                favorites: state.favorites
            })
        }
    )
)