import React from 'react'
import style from './AdminPanelOrders.module.scss'
import NavComponentSection from '../HomePage/section/components/Nav/NavComponentSection'
import OrderItem from '../Orders/components/OrderItem'
import { useOrdersStore } from '../../stores/useOrderStore'
import { useEffect } from 'react'
import { useAuthStore } from '../../stores/useAuthStore'
import { Navigate } from 'react-router-dom'


function AdminPanelOrders() {
  const { fetchAdminOrders, adminOrders, isOrdersError, isOrdersLoading } = useOrdersStore()
  const { isAuthenticated, role } = useAuthStore()
  const isAdmin = role === 2
  console.log('📊 adminOrders:', adminOrders);

  useEffect(() => {
    if (isAuthenticated() && isAdmin) {
      fetchAdminOrders()
    }
  }, [isAuthenticated, isAdmin])

  if (!isAuthenticated() || !isAdmin) {
    return <Navigate to="/" replace />
  }

  if (isOrdersLoading) {
    return (
      <section className={style['admin-orders']}>
        <NavComponentSection
          primaryLink='Главная'
          secondLink='Заказы'
        />
        <div className={style['admin-orders__loading']}>
          Загрузка заказов...
        </div>
      </section>
    )
  }

  if (isOrdersError) {
    return (
      <section className={style['admin-orders']}>
        <NavComponentSection
          primaryLink='Главная'
          secondLink='Заказы'
        />
        <div className={style['admin-orders__error']}>
          {isOrdersError}
        </div>
      </section>
    )
  }

  return (
    <section className={style['admin-orders']}>
      <NavComponentSection
        primaryLink='Главная'
        secondLink='Заказы'
      />
      <div className={style['admin-orders__container']}>
        <h1 className={style['admin-orders__title']}>
          Админиистрирование заказов
        </h1>
        <div className={style['admin-orders__list']}>
          {adminOrders.map(order => (
            <OrderItem
              id={order.id}
              order={order}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default AdminPanelOrders