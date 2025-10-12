import React from 'react'
import styles from './FormPayment.module.scss'
import { useCart } from '../../../../../../context/CartContext'

function FormPayment({ 
    totalQuantityProduct = 0,
    totalPrice = 0, 
    originalPrice = 0, 
    totalDiscount = 0, 
    itemsCount = 0, 
    hasSelectedItems = false,
}) {

    const { createOrder, isOrderLoading } = useCart();

    const isAlert = totalPrice > 1000 ? true : false

    const handleAddOrder = async () => {

    }

    if (!hasSelectedItems) {
        return (
            <div className={styles['form-disabled']}>
                <div className={styles['form-disabled__container_svg']}>
                    <svg width="100" height="100" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M35.6684 16.819H4.28574C3.62823 16.819 3.09131 17.3764 3.1516 18.0343C3.8407 25.8488 11.1107 31.9999 19.9771 31.9999C28.8435 31.9999 36.1134 25.8517 36.8025 18.0343C36.86 17.3764 36.3259 16.819 35.6684 16.819Z" fill="#FF6633"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M0.225147 3.33137C1.7887 1.27854 4.60645 0 7.711 0C10.8155 0 13.6333 1.27854 15.1969 3.33137C15.5659 3.81589 15.4714 4.50716 14.9858 4.87537C14.5001 5.24357 13.8073 5.14928 13.4383 4.66476C12.3661 3.25707 10.2569 2.20377 7.711 2.20377C5.16509 2.20377 3.05591 3.25707 1.98374 4.66476C1.6147 5.14928 0.921857 5.24357 0.436236 4.87537C-0.0493858 4.50716 -0.143894 3.81589 0.225147 3.33137Z" fill="#414141"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M24.7671 3.33137C26.3307 1.27854 29.1484 0 32.253 0C35.3552 0 38.1721 1.27884 39.7381 3.33045C40.1077 3.81458 40.0139 4.50596 39.5287 4.87467C39.0434 5.24338 38.3505 5.14981 37.981 4.66568C36.9055 3.25676 34.7955 2.20377 32.253 2.20377C29.7071 2.20377 27.5979 3.25707 26.5257 4.66476C26.1567 5.14928 25.4638 5.24357 24.9782 4.87537C24.4926 4.50716 24.3981 3.81589 24.7671 3.33137Z" fill="#414141"/>
                    </svg>
                </div>
                <div className={styles['form-disabled__container_alert']}>
                    <div className={styles['form-disabled__alert']}>
                        Необходимо выбрать товары
                    </div>
                </div>
            </div>
        )
    } else {

  return (
    <div className={styles.form}>
        <div className={styles.form__container_info}>
            <div className={styles.form__radio_container}>
                <input type="radio" />
                <p className={styles.form__price}>
                    Списать 
                </p>
            </div>
            <p className={styles.form__descr}>
                На карте накоплено 200 ₽ 
            </p>
        </div>
        <div className={styles.form__container_price}>
            <div className={styles.form__content_container}>
                <p className={styles.form__descr}>
                    {totalQuantityProduct} товара
                </p>
                <p className={styles.form__price}>
                    {originalPrice} 
                </p>
            </div>
            <div className={styles.form__content_container}>
                <p className={styles.form__descr}>
                    Скидка
                </p>
                <p className={styles.form__primary_price}>-{totalDiscount}₽ </p>
            </div>
        </div>
        <div className={styles.form__container_info}>
            <div className={styles.form__content_container}>
                <p className={styles.form__descr}>
                    Итог
                </p>
                <p className={styles.form__finally_price}>
                    {totalPrice}₽
                </p>
            </div>
            <div className={styles.form__content_container}>
                <p className={styles.form__alert}>
                    <svg width="25" height="12" viewBox="0 0 25 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.6883 0.666611H1.31196C0.843143 0.666611 0.460308 1.05823 0.503301 1.52051C0.994639 7.0113 6.17826 11.3333 12.5001 11.3333C18.822 11.3333 24.0056 7.01332 24.497 1.52051C24.5379 1.05823 24.1571 0.666611 23.6883 0.666611Z" fill="#70C05B"/>
                    </svg>
                    Вы получяете 100 бонусов
                </p>
            </div>
        </div>
        <div className={styles.form__container_btn}>
            <div className={styles.form__order_container}>
                {!isAlert ? (                <div className={styles.form__order_border}>
                    <p className={styles.form__order_alert}>
                        Минимальная сумма заказа 1000р
                    </p>
                </div>) : null}
                <button className={styles.form__order_btn}
                onClick={handleAddOrder}
                disabled={!isAlert}
                >
                    Оформить заказ
                </button>
            </div>
        </div>
    </div>
  )
}}

export default FormPayment