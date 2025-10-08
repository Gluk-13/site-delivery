import React, {useState, useEffect, useContext, createContext, Children} from "react";
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '/api';
const FavoritesContext = createContext();

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if(!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider')
    }
    return context
}

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect (() => {
        loadFavorites()
    }, [])

    const loadFavorites = async () => {
        try {
            const token = localStorage.getItem('authToken')
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/favorites`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log('Response status:', response.status); 
            if (response.ok) {
                const data = await response.json();
                setFavorites(data || []);
            } else {
                setFavorites([]);
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
            setFavorites([]);
        } finally {
            setLoading(false);
        }
    }

    const addToFavorites = async (productId) => {
        try {
        const token = localStorage.getItem('authToken')
        const response = await fetch(`${API_BASE_URL}/favorites/items`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId })
        });

        if (response.ok) {
            const updatedFavorites = await response.json();
            setFavorites(updatedFavorites);
        }
        } catch (error) {
        console.error('Error adding to favorites:', error);
        }
    };

    const removeFromFavorites = async (productId) => {
        try {
        const token = localStorage.getItem('authToken')
        const response = await fetch(`${API_BASE_URL}/favorites/items/${productId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const updatedFavorites = await response.json();
            setFavorites(updatedFavorites);
        }
        } catch (error) {
        console.error('Error removing from favorites:', error);
        }
    };

    const isInFavorites = (productId) => {
        return Array.isArray(favorites) && favorites.includes(productId);
    };

    const favoritesCount = Array.isArray(favorites) ? favorites.length : 0;

    const value = {
        favorites,
        loading,
        addToFavorites,
        removeFromFavorites,
        isInFavorites,
        favoritesCount,
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
}