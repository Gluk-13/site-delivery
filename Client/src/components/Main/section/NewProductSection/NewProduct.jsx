import React from 'react'
import styles from './NewProduct.module.scss'
import ContentTitle from '../components/ContentTitle/ContentTitle'
import CardContent from '../components/CardContent/CardContent'


function NewProduct() {
  return (
    <section className={styles['new-product']}>
      <ContentTitle
        titleText='Новинки'
        buttonText='Все новинки'
      />
      <div className={styles['new-product__container_content']}>
        <CardContent/>
      </div>
    </section>
  )
}

export default NewProduct