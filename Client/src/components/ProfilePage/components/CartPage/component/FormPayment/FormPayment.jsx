import React from 'react'
import styles from './FormPayment.module.scss'

function FormPayment() {
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
                    3 товара
                </p>
                <p className={styles.form__price}>
                    258,10  ₽ 
                </p>
            </div>
            <div className={styles.form__content_container}>
                <p className={styles.form__descr}>
                    Скидка
                </p>
                <p className={styles.form__primary_price}>-8,01  ₽ </p>
            </div>
        </div>
        <div className={styles.form__container_info}>
            <div className={styles.form__content_container}>
                <p className={styles.form__descr}>
                    Итог
                </p>
                <p className={styles.form__finally_price}>
                    250,09 ₽ 
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
                <div className={styles.form__order_border}>
                    <p className={styles.form__order_alert}>
                        Минимальная сумма заказа 1000р
                    </p>
                </div>
                <button className={styles.form__order_btn}>
                    Оформить заказ
                </button>
            </div>
        </div>
    </div>
  )
}

export default FormPayment