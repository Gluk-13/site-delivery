import React, { useState } from 'react'
import { useAddToCart } from '../../../../../../hooks/useAddToCart';
import styles from './CardCart.module.scss'

function CardCart( { productQuantity, product, onUpdate, selectedItem } ) {
    const { id, name, price, discount_percent, discount_price, imageUrl } = product
    const { addToCart, isLoading, isError, clearError } = useAddToCart()
    const [quantity, setQuantity] = useState(productQuantity || 1)
    const [isFinallyPrice, setIsFinallyPrice] = useState (price * (productQuantity || 1))
    const baseUrl = '/api/uploads'
    const [isAdded, setIsAdded] = useState(false)



    const hundleAddToCart = async (qty = quantity) => {
        const response = await addToCart(id, qty)
        if (response.success) {
            setIsAdded(true)
            onUpdate
        }
    }

    const hundleIncrement = () => {
        const newQuantity = quantity + 1
        setQuantity(newQuantity)
        hundleAddToCart(newQuantity)
        setIsFinallyPrice(newQuantity * price)
    }

    const hundleDecrement = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1
            setQuantity(newQuantity)
            hundleAddToCart(newQuantity)
            setIsFinallyPrice(newQuantity * price)
        }
    }

  return (
    <div className={styles.card}>
        <div className={styles.card__container_img}>
            <img className={styles.card__img} src={`${baseUrl}${imageUrl}`} alt="Картинка товара" />
            <label className={styles.card__checkbox}>
                <input 
                    id={`checkbox-${id}`} 
                    type="checkbox"
                    onClick={selectedItem}
                />
            </label>
        </div>
        <div className={styles.card__container_info}>
            <h3 className={styles.card__info_title}>{name}</h3>
            {discount_price ? (
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
                    onClick={hundleDecrement}
                    disabled={quantity === 1}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M4.5 12C4.5 11.7239 4.72386 11.5 5 11.5H19C19.2761 11.5 19.5 11.7239 19.5 12C19.5 12.2761 19.2761 12.5 19 12.5H5C4.72386 12.5 4.5 12.2761 4.5 12Z" fill="white"/>
                        </svg>
                    </button>
                    <p className={styles.card__quantity_descr}>{quantity}</p>
                    <button className={styles.card__quantity_btn}
                    onClick={hundleIncrement}
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
                    {isFinallyPrice}₽
                </p>
            </div>
        </div>
    </div>
  )
}

export default CardCart