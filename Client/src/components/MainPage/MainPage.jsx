import React from 'react'
import styles from './MainPage.module.scss'
import { Outlet } from 'react-router-dom'
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'

function MainPage() {
  return (
    <main className={styles.main}>
      <div className={styles.main__content}>
        <ProtectedRoute>
          <Outlet/>
        </ProtectedRoute>
      </div>
    </main>
  )
}

export default MainPage