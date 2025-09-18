import React from 'react'
import styles from './HomePage.module.scss'
import Sale from './section/SaleProductSection/Sale'
import NewProduct from './section/NewProduct/NewProduct'
import MapSection from './section/MapSection/MapSection'

function HomePage() {
  return (
    <section className={styles.home}>
      <Sale/>
      <NewProduct/>
      <MapSection/>
    </section>
  )
}

export default HomePage