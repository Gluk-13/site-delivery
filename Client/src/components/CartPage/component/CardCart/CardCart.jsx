import React, { useState } from 'react'
import styles from './CardCart.module.scss'
import { useCartStore } from '../../../../stores/useCartStore.js'

function CardCart({
    productQuantity,
    product,
    isSelected = false,
    onSelectChange,
    }) {

    const { 
        addToCart, 
        removeItemInCart, 
        isLoading, 
    } = useCartStore();

    const { id, name, price, discount_percent, discount_price, imageUrl } = product
    const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '/api';
    const [imageError, setImageError] = useState(false);

    const getImageUrl = () => {
        if (imageError) {
            return '/placeholder-image.jpg';
        }
        if (!imageUrl) {
            console.warn('Image URL is undefined for product:', id);
            return '/placeholder-image.jpg';
        }
        const formattedImageUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
        return `${API_BASE_URL}${formattedImageUrl}`;
    }

    const handleAddToCart = async (qty = productQuantity) => {
        await addToCart(id, qty)
    }

    const handleRemoveFromCart = async () => {
        await removeItemInCart(id);
    }

    const handleIncrement = () => {
        const newQuantity = productQuantity + 1
        handleAddToCart(newQuantity)
    }

    const handleDecrement = async () => {
        if (productQuantity > 1) {
            const newQuantity = productQuantity - 1
            await handleAddToCart(newQuantity)
        } else if (productQuantity === 1) {
            await handleRemoveFromCart()
        } else {
            console.log('Неожиданное количество:', productQuantity);
        }
    }

    const handleCheckboxChange = (e) => {
        onSelectChange && onSelectChange(e.target.checked)
    }

    const currentPrice = discount_price || price;
    const totalPrice = currentPrice * (productQuantity || 1);

  return ( 
    <div className={styles.card}>
        <div className={styles.card__container_img}>
            <img className={styles.card__img} 
            src={getImageUrl()} 
            alt=""
            onError={() => setImageError(true)} 
            />
            <label className={styles.card__checkbox}>
                <input 
                    id={`checkbox-${id}`} 
                    type="checkbox"
                    checked={isSelected}
                    onChange={handleCheckboxChange}
                    className={styles.card__input_filter}
                />
                <span className={styles.card__checkbox_checkmark}></span>
            </label>
            {imageError && <div className={styles.card__placeholder}>Ошибка загрузки</div>}
        </div>
        <div className={styles.card__container_info}>
            <h3 className={styles.card__info_title}>{name}</h3>
            {!discount_price ? (
            <p className={styles.card__info_descr}>
                {price}₽
            </p>
            ) : (
            <div className={styles.card__info_container}>
                <div className={styles.card__container_price}>
                    <p className={styles.card__info_descr}>
                        {discount_price}₽
                    </p>
                    <p className={styles.card__descr_gray}>
                        С картой
                    </p>
                </div>
                <div className={styles.card__container_price}>
                    <p className={styles.card__info_descr}>
                        {price}₽
                    </p>
                    <p className={styles.card__descr_gray}>
                        Обычная
                    </p>
                </div>
                <p className={styles.card__info_descr}>за шт.</p>
                <div className={styles.card__discount_container}>
                    -{discount_percent}%
                </div>
            </div>
            )}
        </div>
        <div className={styles.card__container_quantity}>
            <div className={styles.card__container_btn}>
                <div className={styles.card__btn_container}>
                    <button className={styles.card__quantity_btn}
                    onClick={handleDecrement}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M4.5 12C4.5 11.7239 4.72386 11.5 5 11.5H19C19.2761 11.5 19.5 11.7239 19.5 12C19.5 12.2761 19.2761 12.5 19 12.5H5C4.72386 12.5 4.5 12.2761 4.5 12Z" fill="white"/>
                        </svg>
                    </button>
                    <p className={styles.card__quantity_descr}>{productQuantity || 1}</p>
                    <button className={styles.card__quantity_btn}
                    onClick={handleIncrement}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 4.5C12.2761 4.5 12.5 4.72386 12.5 5V19C12.5 19.2761 12.2761 19.5 12 19.5C11.7239 19.5 11.5 19.2761 11.5 19V5C11.5 4.72386 11.7239 4.5 12 4.5Z" fill="white"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M4.5 12C4.5 11.7239 4.72386 11.5 5 11.5H19C19.2761 11.5 19.5 11.7239 19.5 12C19.5 12.2761 19.2761 12.5 19 12.5H5C4.72386 12.5 4.5 12.2761 4.5 12Z" fill="white"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div className={styles.card__container_price}>
                <p className={styles.card__quantity_price}>
                    {totalPrice}₽
                </p>
            </div>
        </div>
    </div>
  )
}

export default CardCart