import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FormPayment from './component/FormPayment/FormPayment'
import styles from './CartPage.module.scss'
import NavComponentSection from '../../../HomePage/section/components/Nav/NavComponentSection'
import CardCart from './component/CardCart/CardCart'

function CartPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [cartItem, setCartItem] = useState([])
  const [isEmpty, setIsEmpty] = useState(false)
  const userId = localStorage.getItem('userId')

  const fetchCart = async () => {
    const response = await fetch(`/api/cart?userId=${userId}`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    try {

      if (!response.ok) {
        throw new Error('Ошибка при загрузки корзины')
      }

      const cartData = await response.json()
      setCart(cartData)
      setIsEmpty(cartData.length < 1)

      const response = await fetch('/api/products/bulk')

    } catch (error) {
      setCart([])
      setIsEmpty(true)
      setIsLoading(false)
      console.error('Ошибка при получении данных корзины',error)
    
    } finally {
      setIsLoading(false)
    }
  }




  useEffect (()=>{
    fetchCart()
  },[])

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
            <p className={styles.cart__quantity}>{quantity.length}</p>
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
              {isLoading === true ? (<p>Загрузка...</p>) : isEmpty === true ? (<p>Корзина пустая</p>) : cart.product.map(item => {
                <CardCart
                key={item.product.id}
                product={item.product}
                quantity={item.quantity} 
                />
              })}
            </div>
          </div>
          <FormPayment/>
        </div>
      </div>
    </section>
  )
}

export default CartPage