import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import FormPayment from './component/FormPayment/FormPayment'
import styles from './CartPage.module.scss'
import NavComponentSection from '../../../HomePage/section/components/Nav/NavComponentSection'
import CardCart from './component/CardCart/CardCart'
import { useCart } from '../../../../context/CartContext';

function CartPage() {
  const {
    isLoading,
    isRemoving,
    cartData,
    productsData,
    isEmpty,
    refetch,
    removeItemInCart,
  } = useCart();

  const [selectedItems, setSelectedItems] = useState([])

  const getCartItems = useMemo(() => {
    if (cartData.length === 0 || productsData.length === 0) {
      return []
    }

    const items = cartData.map(cartItem => {
      const product = productsData.find(p => p.id === cartItem.productId)
      return {
        ...cartItem,
        product: product || null
      }
    }).filter(item => item.product !== null)
    return items;
  }, [cartData, productsData])

  const handleSelectAll = () => {
    if (selectedItems.length === getCartItems.length) {
      setSelectedItems([])
    } else {
      const allIds = getCartItems.map(item => item.productId)
      setSelectedItems(allIds)
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;

    try {
      const deletePromises = selectedItems.map(productId => 
        removeItemInCart(productId)
      )
      await Promise.all(deletePromises)

      setSelectedItems([])

    } catch(error) {
      console.error('Ошибка при удалении товаров', error)
    }
  }

  const handleItemSelect = (productId, isSelected) => {
    if (isSelected) {
      setSelectedItems(prev => [...prev, productId])
    } else {
      setSelectedItems(prev => prev.filter(id => id !== productId))
    }
  }

  useEffect(() => {
    const currentProductIds = getCartItems.map(item => item.productId);
    setSelectedItems(prev => prev.filter(id => currentProductIds.includes(id)));
  }, [getCartItems]);

  //Рассчеты данных под заполнение форм
  const useCartCalculations = () => {
    const getItemsToCalculate = () => {
      if (!getCartItems || !Array.isArray(getCartItems)){
        return [];
      }

      return selectedItems.length > 0 
      ? getCartItems.filter(item => selectedItems.includes(item.productId))
      : getCartItems
    }

    const calcTotalQuantity = () => {
      const items = getItemsToCalculate();
      let total = 0;
      for (const item of items) {
        total += item.quantity
      }
      return total
    }

    const calcTotalPrice = () => {
      const items = getItemsToCalculate();
      let total = 0;
      for (const item of items) {
        const price = item.product?.discount_price || item.product?.price || 0
        total += price * item.quantity
      }
      return total
    }

    const calcOriginPrice = () => {
      const items = getItemsToCalculate();
      let total = 0;
      for (const item of items) {
        const price = item.product?.price || 0
        total += price * item.quantity
      }
      return total
    }

    const calcTotalDiscounted = () => {
      const original = calcOriginPrice();
      const withDiscount = calcTotalPrice();
      return Math.max(0, original - withDiscount);
    }

    const getAllCalculations = () => {
      return {
        totalQuantity: calcTotalQuantity(),
        totalPrice: calcTotalPrice(),
        originalPrice: calcOriginPrice(),
        totalDiscount: calcTotalDiscounted(),
        itemsCount: getItemsToCalculate().length,
        hasSelectedItems: selectedItems.length > 0
      };
    };

    return {
      calcTotalQuantity,
      calcTotalPrice,
      calcOriginPrice,
      calcTotalDiscounted,
      getAllCalculations
    };
  }

  const cartCalculations = useCartCalculations();
  const cartDataForForm = cartCalculations.getAllCalculations();

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
            <p className={styles.cart__quantity}>{cartDataForForm.totalQuantity}</p>
          </div>
        </div>
        <div className={styles.cart__container_cart}>
          <div className={styles.cart__container_list}>
            <div className={styles.cart__filter_container}>
              <label className={styles.cart__checkbox}>
                <input 
                  onChange={handleSelectAll}
                  type="checkbox"
                  checked={getCartItems.length > 0 && selectedItems.length === getCartItems.length}
                  className={styles.cart__input_filter}
                />
                
                <span className={styles.cart__checkbox_checkmark}></span>
                Выделить всё
              </label>
              <button disabled={selectedItems.length === 0 || isRemoving} 
              onClick={handleDeleteSelected} className={styles.cart__delete_link}>Удалить выбранные</button>
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
                    isSelected={selectedItems.includes(item.productId)}
                    onSelectChange={(isSelected) => handleItemSelect(item.productId, isSelected)}
                  />
                ))
              )}
            </div>
          </div>
          <FormPayment 
            totalQuantityProduct={cartDataForForm.totalQuantity}
            totalPrice={cartDataForForm.totalPrice}
            originalPrice={cartDataForForm.originalPrice}
            totalDiscount={cartDataForForm.totalDiscount}
            itemsCount={cartDataForForm.itemsCount}
            hasSelectedItems={cartDataForForm.hasSelectedItems}
          />
        </div>
      </div>
    </section>
  )
}

export default CartPage