import React, { useState, useEffect } from 'react'
import styles from './CardContent.module.scss'
import { useCart } from '../../../../../context/CartContext';
import { useFavorites } from '../../../../../context/FavoritesContext';

function CardContent({ productId, name, price, discountPrice, imageUrl, rating, discountPercent, onRemoveFromFavorites, onAddToFavorites }) {
    const { isError, isLoading, cartData, addToCart, removeItemInCart, clearError } = useCart()
    const { favorites, loading: favoritesLoading, addToFavorites, removeFromFavorites, isInFavorites } = useFavorites()
    const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
    const percentFloor = Math.floor(discountPercent)

    const cartItem = cartData.find(item => item.productId === productId);
    const isAdded = !!cartItem;
    const quantity = cartItem?.quantity || 1;

    const isProductInFavorites = isInFavorites(productId);
    
    const handleAddToCart = async (qty = 1) => {
        await addToCart(productId, qty);
    }

    const handleRemoveFromCart = async () => {
        await removeItemInCart(productId);
    };

    const handleAddedClick = () => {
        handleAddToCart(1)
    }

    const handleIncrement = () => {
        const newQuantity = quantity + 1
        handleAddToCart(newQuantity)
    }

    const handleDecrement = async () => {
        if(quantity > 1) {
            const newQuantity = quantity - 1
            handleAddToCart(newQuantity)
        } else {
            await handleRemoveFromCart();
        }
    }

    const handleAddAndRemoveToFavorites = async () => {
        if (isProductInFavorites) {
            await removeFromFavorites(productId);
            if (onRemoveFromFavorites) {
                onRemoveFromFavorites(productId);
            }
       } else {
            await addToFavorites(productId);
            if (onAddToFavorites) {
                onAddToFavorites(productId);
            }
       }
    }

    function CalcStars (rating) {
        const stars = [];
        const fullStars = Math.floor(rating)

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push( <div key={i} className={styles.card__star_svg}>
                                <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.10326 0.816985C6.47008 0.0737389 7.52992 0.0737404 7.89674 0.816986L9.11847 3.29249C9.26413 3.58763 9.5457 3.7922 9.87141 3.83953L12.6033 4.2365C13.4235 4.35568 13.751 5.36365 13.1575 5.94219L11.1807 7.8691C10.945 8.09884 10.8375 8.42984 10.8931 8.75423L11.3598 11.4751C11.4999 12.292 10.6424 12.9149 9.90881 12.5293L7.46534 11.2446C7.17402 11.0915 6.82598 11.0915 6.53466 11.2446L4.09119 12.5293C3.35756 12.9149 2.50013 12.292 2.64024 11.4751L3.1069 8.75423C3.16254 8.42984 3.05499 8.09884 2.81931 7.8691L0.842496 5.94219C0.248979 5.36365 0.576491 4.35568 1.39671 4.2365L4.12859 3.83953C4.4543 3.7922 4.73587 3.58763 4.88153 3.29249L6.10326 0.816985Z" fill="#FF6633"/>
                                </svg>
                            </div>);
            } else {
                    stars.push( <div key={i} className={styles.card__star_svg}>
                                    <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.10326 0.816985C6.47008 0.0737389 7.52992 0.0737404 7.89674 0.816986L9.11847 3.29249C9.26413 3.58763 9.5457 3.7922 9.87141 3.83953L12.6033 4.2365C13.4235 4.35568 13.751 5.36365 13.1575 5.94219L11.1807 7.8691C10.945 8.09884 10.8375 8.42984 10.8931 8.75423L11.3598 11.4751C11.4999 12.292 10.6424 12.9149 9.90881 12.5293L7.46534 11.2446C7.17402 11.0915 6.82598 11.0915 6.53466 11.2446L4.09119 12.5293C3.35756 12.9149 2.50013 12.292 2.64024 11.4751L3.1069 8.75423C3.16254 8.42984 3.05499 8.09884 2.81931 7.8691L0.842496 5.94219C0.248979 5.36365 0.576491 4.35568 1.39671 4.2365L4.12859 3.83953C4.4543 3.7922 4.73587 3.58763 4.88153 3.29249L6.10326 0.816985Z" fill="#BFBFBF"/>
                                    </svg>
                                </div>);
            }
        }
        
        return stars;
    }

  return (
    <div className={styles.card}>
        <div className={styles.card__container_img} style={{
            backgroundImage:`url('${API_BASE_URL}/uploads/${imageUrl}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}
        onError={(e) => {
            e.target.style.backgroundImage = "url('/default-image.jpg')";
        }}
        >
            <div className={styles.card__svg_favorite}>
                <button 
                className={styles.card__container_svg}
                onClick={handleAddAndRemoveToFavorites}
                disabled={favoritesLoading}
                >
                    {isProductInFavorites ? (
                        <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path 
                                d="M11 19.5L9.55 18.15C4.4 13.65 1 10.725 1 7.125C1 4.125 3.3 1.75 6.25 1.75C7.975 1.75 9.625 2.55 10.75 3.8C11.875 2.55 13.525 1.75 15.25 1.75C18.2 1.75 20.5 4.125 20.5 7.125C20.5 10.725 17.1 13.65 11.95 18.15L11 19.5Z" 
                                fill="#FF6633"
                            />
                        </svg>
                    ) : (
                        <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path 
                                d="M11 19.5L9.55 18.15C4.4 13.65 1 10.725 1 7.125C1 4.125 3.3 1.75 6.25 1.75C7.975 1.75 9.625 2.55 10.75 3.8C11.875 2.55 13.525 1.75 15.25 1.75C18.2 1.75 20.5 4.125 20.5 7.125C20.5 10.725 17.1 13.65 11.95 18.15L11 19.5Z" 
                                fill="none"
                                stroke="#BFBFBF"
                                strokeWidth="1.5"
                            />
                        </svg>
                    )}
                </button>
                {discountPercent && (
                <div className={styles.card__sale_info}>
                    <p className={styles.card__sale_descr}>-{percentFloor}%</p>
                </div>)
                }
            </div>
        </div>
        <div className={styles.card__container_content}>
            <div className={styles.card__price_info}>
                <div className={styles.card__price_new}>
                    <h1 className={`${styles.card__price_title} ${styles.card__newPrice_title}`}>{discountPrice}₽</h1>
                    <p className={styles.card__price_subtitle}>С картой</p>
                </div>
                <div className={styles.card__price_old}>
                    <h1 className={styles.card__price_title}>{price}₽</h1>
                    <p className={styles.card__price_subtitle}>Обычная</p>
                </div>
            </div>
            <div className={styles.card__info_product}>
                <p className={styles.card__info_descr}>{name}</p>
            </div>
            <div className={styles.card__score_product}>
                {CalcStars(rating)}
            </div>
            {!isAdded ? (
                <button className={styles.card__cart_btn}
                onClick={handleAddedClick}
                disabled={isLoading}
                >
                    { isLoading ? 'Добавление...' : 'В корзину'}
                </button>) : (
                <div className={styles.card__added_container}>
                    { isError && (
                        <div className={styles.card__error_container}>
                            <p className={styles.card__error_message}>
                                {isError}
                            </p>
                            <button onClick={clearError}>x</button>
                        </div>
                    )}
                    <p className={styles.card__added_descr}>
                        Добавлено: {quantity} шт.
                    </p>
                    <div className={styles.card__container_btn}>
                        <button 
                        className={styles.card__added_btn}
                        onClick={handleIncrement}
                        disabled={isLoading}
                        >
                            +
                        </button>
                        <button 
                        className={styles.card__added_btn}
                        onClick={handleDecrement}
                        disabled={isLoading}
                        >
                            -
                        </button>
                    </div>
                </div>
                )}
        </div>
    </div>
  )
}

export default CardContent