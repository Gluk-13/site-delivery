import React from 'react'
import styles from './Delivery.module.scss'
import image from '../../reference/image/delivery__img.png'

function Delivery() {
  return (
    <div className={styles.delivery}>
        <div className={styles.delivery__content}>
            <img src={image} alt="Продукты" className={styles.delivery__img} />
            <h1 className={styles.delivery__title}>
                Доставка бесплатно от 1000 ₽
            </h1>
        </div>
    </div>
  )
}

export default Delivery