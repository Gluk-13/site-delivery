import React from 'react'
import styles from './Orders.module.scss'
import OrderItem from './components/OrderItem'
import NavComponentSection from '../HomePage/section/components/Nav/NavComponentSection'

function Orders() {

  return (
    <section className={styles.orders}>
        <NavComponentSection
            primaryLink='Главная'
            secondLink='Заказы'
        />
        <div className={styles.orders__content_container}>
            <h1 className={styles.orders__container_title}>
            Заказы
            </h1>
        </div>
        <div className={styles.orders__container_list}>
          <OrderItem
          
          />
        </div>
    </section>
  )
}

export default Orders