import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCartStore } from './useCartStore';
import { useFavoriteStore } from './useFavoriteStore';
import { useOrdersStore } from './useOrderStore';
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const useAuthStore = create(
    persist (
        (set, get) => ({
            user: null,
            token: null,
            isLoading: false,
            error: null,
            role: null,

            setLoading: (isLoading) => set({ isLoading }),

            setError: (error) => set({ error }),

            login: async (email, password) => {
                try {
                    set({ isLoading: true, error: null })
                    
                    const response = await fetch(`${API_BASE_URL}/users/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password })
                    })

                    const data = await response.json()

                    if (!response.ok) {
                        set({ isLoading: false })
                        throw new Error(data.message || 'Ошибка входа')
                    }

                    const { token, success, user, role } = data

                    set ({
                        user: {
                            id: user.id,
                            email: user.email,
                            userName: user.userName,
                            role: user.role
                        },
                        token: token,
                        success: success,
                        isLoading: false,
                        error: null,
                        role: user.role
                    })

                    useCartStore.getState().fetchCart();
                    useFavoriteStore.getState().loadFavorites();
                    useOrdersStore.getState().fetchOrders();
                    
                    return {success: true}

                } catch (error) {
                    console.error(`${error.message}`,error)
                    set({
                        error: error.message,
                        isLoading: false,
                    })
                    return ({ success: false, message: error.message })
                }
            },

            register: async (email, password, name, confirmPassword) => {
                try {
                    set({
                        isLoading: true, error: null
                    })

                    if (password.length < 8) {
                        return { 
                        success: false, 
                        message: 'Минимальное кол-во символов для пароля 8' 
                        };
                    }

                    if (password !== confirmPassword) {
                        set({ isLoading: false })
                        return { 
                            success: false, 
                            message: 'Введены разные пароли' 
                        };
                    }

                    const response = await fetch(`${API_BASE_URL}/users/register`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: email,
                            password: password,
                            name: name,
                        })
                    })

                    if (response.status === 400) {
                        set({ isLoading: false })
                        throw new Error(response.message || 'Пользователь с такой почтой уже есть')
                    }

                    if (response.status === 402) {
                        set({ isLoading: false })
                        throw new Error(response.message || 'Не введен пароль, почта или имя')
                    }

                    const data = await response.json();
                                
                    if (!response.ok) {
                        set({ isLoading: false })
                        throw new Error('Ошибка при регистрации');
                    }

                    set({
                        isLoading: false,
                        error: null
                    });

                    return { success: true, message: 'Регистрация прошла успешно!' };

                } catch(error) {
                    console.error('Ошибка регистрации:', error);
                    set({
                        error: error.message,
                        isLoading: false,
                    });
                    return { success: false, message: error.message };
                }
            },

            resetPassword: async (email, password, confirmPassword) => {
                try {
                    set({ isLoading: true, error: null });

                    if (password.length < 8) {
                        set({ isLoading: false })
                        throw new Error('Минимальное кол-во символов для пароля 8');
                    }

                    if (password !== confirmPassword) {
                        set({ isLoading: false })
                        throw new Error('Введены разные пароли');
                    }

                    const response = await fetch(`${API_BASE_URL}/users/reset`, {
                        method: 'PATCH',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                            body: JSON.stringify({
                            email: email,
                            password: password,
                        })
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        set({ isLoading: false })
                        throw new Error(data.message || 'Ошибка при обновлении пароля');
                    }

                    set({
                        isLoading: false,
                        error: null
                    });

                    return { success: true, message: 'Замена пароля прошла успешно!' };

                } catch (error) {
                    console.error('Ошибка при сбросе пароля:', error);
                    set({
                        error: error.message,
                        isLoading: false,
                    });
                    return { success: false, message: error.message };
                }
            },

            refreshToken: async () => {
                try {
                    const { token } = get();

                    if (!token) {
                        set({ isLoading: false })
                        throw new Error('Невалидный токен!')
                    }

                    const response = await fetch(`${API_BASE_URL}/users/refresh`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                    })

                    if (!response.ok) {
                        set({ isLoading: false })
                        throw new Error('Ошибка обновления токена')
                    }

                    const data = await response.json();
                    const newToken = data.token;

                    set({
                        token: newToken
                    })
                    
                    return newToken;

                } catch(error) {
                    console.error('Refresh token error:', error);
                    get().logout();
                    throw error;
                }
            },

            logout: async () => {
                try {
                    const { token } = get();
                    
                    if (!token) {
                        set({ isLoading: false })
                        throw new Error('Ошибка при получении токена')
                    }

                    await fetch(`${API_BASE_URL}/users/logout`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                    })



                } catch(error) {
                    console.error('Logout error:', error);
                } finally {
                    set({ user: null, token: null, isLoading: false, error: null, role: null, });
                    useCartStore.getState().clearCart();
                    useFavoriteStore.getState().clearFavorites();
                    useOrdersStore.getState().clearOrders();
                }
            },

            isAuthenticated: () => {
                return !!get().token;
            },

            clearError: () => set({ error: null }),
        }),
        {
        name: 'auth-storage',
        partialize: (state) => ({
            user: state.user,
            token: state.token,
            role: state.role
        })
    }) 
)