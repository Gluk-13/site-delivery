import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import FormPayment from './component/FormPayment/FormPayment'
import styles from './CartPage.module.scss'
import NavComponentSection from '../../../HomePage/section/components/Nav/NavComponentSection'
import CardCart from './component/CardCart/CardCart'
import { useCart } from '../../../../hooks/useCart';

function CartPage() {
  const userId = localStorage.getItem('userId')
  const token = localStorage.getItem('authToken')
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '/api';
  const {
    isLoading,
    cartData,
    productsData,
    isEmpty,
    cartItemIds,
    fetchCart,
    refetch,
  } = useCart();

  const [selectedItems, setSelectedItems] = useState([])

  const getCartItems = useMemo(() => {
    if (cartData.length === 0 || productsData.length === 0) {
      return []
    }

    return cartData.map(cartItem => {
      const product = productsData.find(p => p.id === cartItem.productId)
      return {
        ...cartItem,
        product: product || null
      }
    }).filter(item => item.product !== null)
  }, [cartData, productsData])

  const handleSelectAll = () => {
    const allIds = getCartItems.map(item => item.id)
    setSelectedItems(allIds)
  }

  const handleDeleteSelected = async () => {

    try {
      const response = await fetch(`${API_BASE_URL}/cart/items/:productId`,{
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: selectedItems })
      })

      if (!response.ok) {
        throw new Error('Ошибка при удалении на сервере')
      }

      
      await refetch();
      setSelectedItems([])

    } catch(error) {
      console.error('Ошибка при удалении товаров', error)
    }
  }

  return (
    <section className={styles.cart}>
      <NavComponentSection
        primaryLink='Главная'
        secondLink='Корзина'
      />
      <div className={styles.cart__content}>
        <div className={styles.cart__content_container}>
          <h1 className={styles.cart__container_title}>
            Корзина
          </h1>
          <div className={styles.cart__quantity_container}>
            <p className={styles.cart__quantity}>{getCartItems.length}</p>
          </div>
        </div>
        <div className={styles.cart__container_cart}>
          <div className={styles.cart__container_list}>
            <div className={styles.cart__filter_container}>
              <div className={styles.cart__filter}>
                <input 
                  onChange={() => handleSelectAll()}
                  type="checkbox"
                  checked={selectedItems.length === getCartItems.length}
                  className={styles.cart__input_filter}
                />
                <p className={styles.cart__descr_filter}>Выделить всё</p>
              </div>
              <button disabled={selectedItems>=0} onClick={handleDeleteSelected} className={styles.cart__delete_link}>Удалить выбранные</button>
            </div>
            <div className={styles.cart__list}>
              {isLoading ? (
                <p>Загрузка...</p>
              ) : isEmpty ? (
                <p>Корзина пустая</p>
              ) : (
                getCartItems.map(item => (
                  <CardCart
                    key={item.id || item.productId}
                    product={item.product}
                    productQuantity={item.quantity}
                    cartItemId={item.id}
                    price={item.price}
                    imageUrl={item.image_url}
                    onUpdate={fetchCart}
                    selectedItem={selectedItems}
                  />
                ))
              )}
            </div>
          </div>
          <FormPayment items={getCartItems} />
        </div>
      </div>
    </section>
  )
}

export default CartPage