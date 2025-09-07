import React from 'react'
import styles from './News.module.scss'
import ContentTitle from '../components/ContentTitle/ContentTitle'



function News() {
  return (
    <section className={styles['new-product']}>
      <ContentTitle
        titleText='Новинки'
        buttonText='Все новинки'
      />
      <div className={styles['new-product__container_content']}>
        
      </div>
    </section>
  )
}

export default News