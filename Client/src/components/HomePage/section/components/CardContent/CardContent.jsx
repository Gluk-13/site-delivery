import React, { useState, useEffect } from 'react'
import styles from './CardContent.module.scss'
import { useCartStore } from '../../../../../stores/useCartStore.js';
import { useFavoriteStore } from '../../../../../stores/useFavoriteStore.js';
import { useOrdersStore } from '../../../../../stores/useOrderStore.js';

function CardContent({ 
        productId, 
        name, 
        price, 
        discountPrice,
        discountPercent, 
        imageUrl, 
        rating,
        quantityOrder
    }) {

    const { 
        getCartItem, 
        addToCart, 
        removeItemInCart,
        isError,
        isLoading
    } = useCartStore()

    const {  
        isFavoritesLoading,
        addToFavorites, 
        removeFromFavorites, 
        isInFavorites
    } = useFavoriteStore()

    const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

    const cartItem = getCartItem(productId)
    const isAdded = !!cartItem;
    const quantity = cartItem?.quantity || 0
    const isFavorite = isInFavorites(productId)

    const calcValidPercent = () => {
        if (discountPercent) {
            return Math.round(((price - discountPrice) / price) * 100)
        } else {
            return 0
        }
    }

    const handleCartAction = () => {
        if (isAdded) {
        removeItemInCart(productId);
        } else {
        addToCart(productId, 1);
        }
    };

    const handleFavoriteAction = () => {
        if (isFavorite) {
        removeFromFavorites(productId);
        } else {
        addToFavorites(productId);
        }
    };

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity > 0) {
        addToCart(productId, newQuantity);
        } else {
        removeItemInCart(productId);
        }
    };

    const isThisProductLoading = isLoading === true || isFavoritesLoading === true;

    useEffect(()=>{
        !isError
    }, [isError])

    function CalcStars (rating) {
        const stars = [];
        const fullStars = Math.round(rating)

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
        }}
        >
            <div className={styles.card__svg_favorite}>
                <div className={styles.card__cart_container}>
                    {quantityOrder > 0 && (
                        <div className={styles.card__cart_svg}>
                            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M6 21C6 19.6193 7.11929 18.5 8.5 18.5C9.88071 18.5 11 19.6193 11 21C11 22.3807 9.88071 23.5 8.5 23.5C7.11929 23.5 6 22.3807 6 21ZM8.5 19.5C7.67157 19.5 7 20.1716 7 21C7 21.8284 7.67157 22.5 8.5 22.5C9.32843 22.5 10 21.8284 10 21C10 20.1716 9.32843 19.5 8.5 19.5Z" fill="#414141"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M18 21C18 19.6193 19.1193 18.5 20.5 18.5C21.8807 18.5 23 19.6193 23 21C23 22.3807 21.8807 23.5 20.5 23.5C19.1193 23.5 18 22.3807 18 21ZM20.5 19.5C19.6716 19.5 19 20.1716 19 21C19 21.8284 19.6716 22.5 20.5 22.5C21.3284 22.5 22 21.8284 22 21C22 20.1716 21.3284 19.5 20.5 19.5Z" fill="#414141"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M1.5 0.5C1.22386 0.5 1 0.723858 1 1C1 1.27614 1.22386 1.5 1.5 1.5H5.08051C5.83783 5.79147 6.60333 10.0643 7.24931 14.3709C7.43288 15.5947 8.48416 16.5 9.72165 16.5H19.8597C21.0514 16.5 22.0774 15.6588 22.3111 14.4903L23.7503 7.29417C23.936 6.36599 23.226 5.5 22.2795 5.5H7.66046C7.3575 5.5 7.07797 5.58901 6.84436 5.74093L5.99239 0.913107C5.95023 0.674179 5.74262 0.5 5.5 0.5H1.5ZM7.166 7.07417C7.12065 6.77187 7.35478 6.5 7.66046 6.5H22.2795C22.595 6.5 22.8316 6.78866 22.7698 7.09806L21.3305 14.2942C21.1903 14.9953 20.5747 15.5 19.8597 15.5H9.72165C8.97916 15.5 8.34839 14.9568 8.23825 14.2225L7.166 7.07417Z" fill="#414141"/>
                            </svg>
                            <p className={styles.card__cart_quantity}>
                                {quantityOrder}
                            </p>
                        </div>
                    )}
                    <button 
                        className={styles.card__container_svg}
                        onClick={handleFavoriteAction}
                    >
                        <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
                        <path 
                            d="M11 19.5L9.55 18.15C4.4 13.65 1 10.725 1 7.125C1 4.125 3.3 1.75 6.25 1.75C7.975 1.75 9.625 2.55 10.75 3.8C11.875 2.55 13.525 1.75 15.25 1.75C18.2 1.75 20.5 4.125 20.5 7.125C20.5 10.725 17.1 13.65 11.95 18.15L11 19.5Z" 
                            fill={isFavorite ? "#FF6633" : "none"}
                            stroke={isFavorite ? "#FF6633" : "#BFBFBF"}
                            strokeWidth="1.5"
                        />
                        </svg>
                    </button>
                </div>
                {discountPercent && (
                    <div className={styles.card__sale_info}>
                        <p className={styles.card__sale_descr}>-{calcValidPercent()}%</p>
                    </div>
                )}
            </div>
        </div>

        <div className={styles.card__container_content}>
            {discountPercent ? (
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
            ) : (
                <div className={styles.card__price_primary}>
                    <h1 className={styles.card__price_title}>{price}₽</h1>
                </div>
            )}
            <div className={styles.card__info_product}>
                <p className={styles.card__info_descr}>{name}</p>
            </div>
            <div className={styles.card__score_product}>
                {CalcStars(rating)}
            </div>
            {!isAdded ? (
                <button className={styles.card__cart_btn}
                onClick={() => handleQuantityChange(1)}
                disabled={isThisProductLoading}
                >
                    { isThisProductLoading || isError ? 'Добавление...' : 'В корзину'}
                </button>) : (
                <div className={styles.card__added_container}>
                    <p className={styles.card__added_descr}>
                        Добавлено: {quantity} шт.
                    </p>
                    <div className={styles.card__container_btn}>
                        <button 
                        className={styles.card__added_btn}
                        onClick={() => handleQuantityChange(1)}
                        disabled={isThisProductLoading}
                        >
                            +
                        </button>
                        <button 
                        className={styles.card__added_btn}
                        onClick={() => handleQuantityChange(-1)}
                        disabled={isThisProductLoading}
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