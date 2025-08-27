import React from 'react'
import styles from './Main.module.scss'
import Sale from './section/SaleProductSection/Sale'
import NewProduct from './section/NewProductSection/NewProduct'

function Main() {
  return (
    <main className={styles.main}>
        <div className={styles.main__content}>
          <Sale/>
          <NewProduct/>
        </div>
    </main>
  )
}

export default Main