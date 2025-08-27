import React from 'react'
import styles from './Authorization.module.scss'

function Authorization() {
  return (
    <div className={styles.authorization}>
        <div className={styles.authorization__container}>
            <div className={styles.authorization__container_btn}>
                <button className={styles.authorization__cancel_btn}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M18.3536 5.64645C18.5488 5.84171 18.5488 6.15829 18.3536 6.35355L6.35355 18.3536C6.15829 18.5488 5.84171 18.5488 5.64645 18.3536C5.45118 18.1583 5.45118 17.8417 5.64645 17.6464L17.6464 5.64645C17.8417 5.45118 18.1583 5.45118 18.3536 5.64645Z" fill="#414141"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M5.64645 5.64645C5.84171 5.45118 6.15829 5.45118 6.35355 5.64645L18.3536 17.6464C18.5488 17.8417 18.5488 18.1583 18.3536 18.3536C18.1583 18.5488 17.8417 18.5488 17.6464 18.3536L5.64645 6.35355C5.45118 6.15829 5.45118 5.84171 5.64645 5.64645Z" fill="#414141"/>
                    </svg>
                </button>
            </div>
            <div className={styles.authorization__container_content}>
                <h1 className={styles.authorization__title}>Вход</h1>
                <div className={styles.authorization__container_form}>
                    <p className={styles.authorization__descr}>Телефон</p>
                    <form className={styles.authorization__form_telephone}>
                        <input 
                        type="text"
                        className={styles.authorization__form_input}
                        />
                    </form>
                </div>
                <button className={styles.authorization__btn_primary}>Вход</button>
                <div className={styles.authorization__password_btn}>
                    <button className={styles.authorization__register_btn}>Регистрация</button>
                    <button className={styles.authorization__recover_btn}>Забыли пароль?</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Authorization