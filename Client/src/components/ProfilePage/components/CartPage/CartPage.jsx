import React from 'react'
import { Link } from 'react-router-dom'
import FormPayment from './component/FormPayment/FormPayment'
import styles from './CartPage.module.scss'
import NavComponentSection from '../../../HomePage/section/components/Nav/NavComponentSection'

function CartPage() {
  return (
    <section className={styles.cart}>
      <NavComponentSection
        primaryLink = 'Главная'
        secondLink = 'Корзина'
      />
      <div className={styles.cart__content}>
        <div className={styles.cart__content_container}>
          <h1 className={styles.cart__container_title}>
            Корзина
          </h1>
          <div className={styles.cart__quantity_container}>
            <p className={styles.cart__quantity}>3</p>
          </div>
        </div>
        <div className={styles.cart__container_cart}>
          <div className={styles.cart__container_list}>
            <div className={styles.cart__filter_container}>
              <div className={styles.cart__filter}>
                <input 
                type="radio"
                className={styles.cart__input_filter}
                />
                <p className={styles.cart__descr_filter}>Выделить всё</p>
              </div>
              <a href="#!" className={styles.cart__delete_link}>Удалить выбранные</a>
            </div>
            <div className={styles.cart__list}>

            </div>
          </div>
          <FormPayment/>
        </div>
      </div>
    </section>
  )
}

export default CartPage