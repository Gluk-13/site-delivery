import React from 'react'
import styles from './MainPage.module.scss'
import { Outlet } from 'react-router-dom'

function MainPage() {
  return (
    <main className={styles.main}>
      <div className={styles.main__content}>
          <Outlet/>
      </div>
    </main>
  )
}

export default MainPage