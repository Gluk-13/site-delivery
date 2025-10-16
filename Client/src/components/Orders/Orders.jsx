import React, {useState, useEffect} from 'react'
import styles from './Orders.module.scss'
import OrderItem from './components/OrderItem'
import NavComponentSection from '../HomePage/section/components/Nav/NavComponentSection'
import { useOrdersStore } from '../../stores/useOrderStore'
function Orders() {

  const {
    ordersData,
    fetchOrders,
    isOrdersLoading,
    isOrdersError,
    
  } = useOrdersStore()

  console.log(ordersData)

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  if (isOrdersLoading) {
    return <div>Загрузка заказов...</div>
  }

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
          {ordersData.length === 0 || ordersData === false ? (
              <div className={styles.empty}>
                <p>У вас пока нет заказов</p>
                <p>Совершите свой первый заказ в корзине!</p>
              </div>) : (
            ordersData.map(order => (
              <OrderItem
              key={order.id}
              order={order}
              ordersData={ordersData}
              />
            ))
          )}
        </div>
    </section>
  )
}

export default Orders