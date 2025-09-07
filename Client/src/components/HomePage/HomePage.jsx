import React from 'react'
import styles from './HomePage.module.scss'
import Sale from './section/SaleProductSection/Sale'
import NewProduct from './section/NewProduct/NewProduct'

function HomePage() {
  return (
    <main className={styles.main}>
        <div className={styles.main__content}>
          <Sale/>
          <NewProduct/>
        </div>
    </main>
  )
}

export default HomePage