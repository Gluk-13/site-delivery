import React, { useState } from 'react'
import styles from './Authorization.module.scss'
import { useNavigate } from 'react-router-dom';


const Authorization = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); //Загрузка
    const [message, setMessage] = useState(''); //Сообщение от формы
    const [currentView, setCurrentView] = useState('login'); //Определяем какой компонент показать
    const [loginData, setLoginData] = useState({ email: '', password: ''}) //Настраиваем что ждем от форм логин, регистрации и смены пароля
    const [registerData, setRegisterData] = useState({ 
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '/api';
    const [resetData, setResetData] = useState({ email: '', password: '', confirmPassword: ''});

    //Логин и его обработка
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); //Ставим загрузку пока не получим ответ из fetch 
        setMessage(''); //Пустое сообщение до ошибки
        try {
        const response = await fetch(`${API_BASE_URL}/users/login`,{ //Дожидаемся ответа из фетч запроса
                method: 'POST', // POST потому что сверяем данные при авторизации
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email: loginData.email,
                    password: loginData.password
                }), //Парсим то что ввел клиент и отправляем на сервер
            })

            if (!response.ok) {
                throw new Error(`HTTP error status: ${response.status}`)
            }

            const data = await response.json(); //Дожидаемся пока данные станут формата json

            if (data.success) {
                localStorage.setItem('authToken',data.token)
                localStorage.setItem('userName',data.user.userName)
                localStorage.setItem('userId',data.user.id)
                navigate('/')
            } else {
                setMessage(data.message || 'Ошибка подключения...')
            }
        } catch (error){
            setMessage('Ошибка подключения к серверу'); //Обработка ошибки вне конструкции try
        } finally {
            setLoading(false) //Чем бы не закончилась функция выключаем плашку загрзки
        }
    }

    const renderLoginForm = () => ( // Рендер формы под логин
        <form onSubmit={handleLogin} className={styles.authorization__container_content}>
            <h1 className={styles.authorization__title}>Вход</h1>
            <div className={styles.authorization__container_form}>
                <div className={styles.authorization__form}>
                    <label className={styles.authorization__descr}>Почта</label>
                    <input 
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    required
                    className={styles.authorization__form_input}
                    />
                </div>
                <div className={styles.authorization__form}>
                    <label className={styles.authorization__descr}>Пароль</label>
                    <input 
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    required
                    className={styles.authorization__form_input}
                    />
                </div>
            </div>
            <button 
                type='submit'
                disabled={loading}
                className={styles.authorization__btn_primary}
                >
                    {loading ? 'Вход...' : 'Войти'}
            </button>
            <div className={styles.authorization__password_btn}>
                <button 
                    type='button'
                    className={styles.authorization__register_btn}
                    onClick={() => setCurrentView('register')}
                    >
                        Регистрация
                </button>
                <button 
                    type='button'
                    className={styles.authorization__recover_btn}
                    onClick={() => setCurrentView('reset')}
                    >
                        Забыли пароль?
                </button>
            </div>
        </form>
    );

    const handleRegister = async (e) => {
        e.preventDefault();

        if (registerData.password.length < 8) {
            setMessage ('Минимальное кол-во символов для пароля 8')
            return
        } 

        if (registerData.password !== registerData.confirmPassword) {
            setMessage ('Введены разные пароли')
            return
        }

        setLoading(true);
        setMessage('');
        try {
            const response = await fetch(`${API_BASE_URL}/users/register`,{
                method: 'PUT',
                headers: {'Content-type':'application/json'},
                body: JSON.stringify({
                    name: registerData.name,
                    email: registerData.email,
                    password: registerData.password,
                }),
            })

            const data = await response.json(); //Дожидаемся парсинга в json формат

            if (data.ok) {
                setMessage('Регистрация прошла успешно!')
                setTimeout (()=>{
                    setCurrentView('login');
                    setMessage('');
                    },2000) //Даем знать что регистрация прошла успешно и отправляем на логин
            } else {
                setMessage(data.message || 'Ошибка подключения...') //Может произойти только если что-то не правильно настроено, значит для отладки
            }
        } catch (error) {
            setMessage('Ошибка подключения к серверу'); //Конкретно проблема бд или сервера (Ну или действительно интернета)
        } finally {
            setLoading(false); //Опять отключаем загрузку
        }
    }

    const renderRegisterForm = () => (
        <form onSubmit={handleRegister} className={styles.authorization__container_content}>
            <h1 className={styles.authorization__title}>Регистрация</h1>
            <div className={styles.authorization__container_form}>
                <div className={styles.authorization__form}>
                    <label className={styles.authorization__descr}>Имя</label>
                    <input 
                    type="text"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                    required
                    className={styles.authorization__form_input}
                    />
                </div>
                <div className={styles.authorization__form}>
                    <label className={styles.authorization__descr}>Почта</label>
                    <input 
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    required
                    className={styles.authorization__form_input}
                    />
                </div>
                <div className={styles.authorization__form}>
                    <label className={styles.authorization__descr}>Пароль</label>
                    <input 
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    required
                    className={styles.authorization__form_input}
                    />
                </div>
                    <div className={styles.authorization__form}>
                    <label className={styles.authorization__descr}>Подтвердите пароль</label>
                    <input 
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                    required
                    className={styles.authorization__form_input}
                    />
                </div>
            </div>
            <button 
                type='submit'
                disabled={loading}
                className={styles.authorization__btn_primary}
                >
                    {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
            <div className={styles.authorization__password_btn}>
                <button 
                    type='button'
                    className={styles.authorization__register_btn}
                    onClick={() => setCurrentView('login')}
                    >
                        Назад
                </button>
                <button 
                    type='button'
                    className={styles.authorization__recover_btn}
                    onClick={() => setCurrentView('reset')}
                    >
                        Забыли пароль?
                </button>
            </div>
        </form>
    )

    const handleReset = async (e) => {
        e.preventDefault();

        if (resetData.password.length < 8) {
            setMessage ('Минимальное кол-во символов для пароля 8')
            return
        } 

        if (resetData.password !== resetData.confirmPassword) {
            setMessage ('Введены разные пароли')
            return
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}/users/reset/`, {
                method: 'PATCH',
                headers: {'Content-type':'application/json'},
                body: JSON.stringify ({
                    email: resetData.email,
                    password: resetData.password,
                })
            })
                const data = await response.json();

                if (data.ok) {
                    setMessage('Замена пароля прошла успешно!')
                } else {
                    setMessage(data.message || 'Ошибка подключения...')
                }
            
        } catch {
            setMessage('Ошибка подключения...') 
        } finally {
            setLoading(false);
        }
    }

    const renderResetForm = () => (
        <form onSubmit={handleReset} className={styles.authorization__container_content}>
            <h1 className={styles.authorization__title}>Смена пароля</h1>
            <div className={styles.authorization__container_form}>
                <div className={styles.authorization__form}>
                    <label className={styles.authorization__descr}>Почта</label>
                    <input 
                    type="email"
                    value={resetData.email}
                    onChange={(e) => setResetData({...resetData, email: e.target.value})}
                    required
                    className={styles.authorization__form_input}
                    />
                </div>
                <div className={styles.authorization__form}>
                    <label className={styles.authorization__descr}>Пароль</label>
                    <input 
                    type="password"
                    value={resetData.password}
                    onChange={(e) => setResetData({...resetData, password: e.target.value})}
                    required
                    className={styles.authorization__form_input}
                    />
                </div>
                <div className={styles.authorization__form}>
                    <label className={styles.authorization__descr}>Повторите пароль</label>
                    <input 
                    type="password"
                    value={resetData.confirmPassword}
                    onChange={(e) => setResetData({...resetData, confirmPassword: e.target.value})}
                    required
                    className={styles.authorization__form_input}
                    />
                </div>
            </div>
            <button 
                type='submit'
                disabled={loading}
                className={styles.authorization__btn_primary}
                >
                    {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
            <div className={styles.authorization__password_btn}>
                <button 
                    type='button'
                    className={styles.authorization__register_btn}
                    onClick={() => setCurrentView('login')}
                    >
                        Вход
                </button>
                <button 
                    type='button'
                    className={styles.authorization__recover_btn}
                    onClick={() => setCurrentView('register')}
                    >
                        Регистрация
                </button>
            </div>
        </form>
    )

    return (
        <div className={styles.authorization}>
            <div className={styles.authorization__container}>
                <div className={styles.authorization__container_btn}>
                    {message && <div className={styles.message}>{message}</div>}
                    <button className={styles.authorization__cancel_btn}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M18.3536 5.64645C18.5488 5.84171 18.5488 6.15829 18.3536 6.35355L6.35355 18.3536C6.15829 18.5488 5.84171 18.5488 5.64645 18.3536C5.45118 18.1583 5.45118 17.8417 5.64645 17.6464L17.6464 5.64645C17.8417 5.45118 18.1583 5.45118 18.3536 5.64645Z" fill="#414141"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M5.64645 5.64645C5.84171 5.45118 6.15829 5.45118 6.35355 5.64645L18.3536 17.6464C18.5488 17.8417 18.5488 18.1583 18.3536 18.3536C18.1583 18.5488 17.8417 18.5488 17.6464 18.3536L5.64645 6.35355C5.45118 6.15829 5.45118 5.84171 5.64645 5.64645Z" fill="#414141"/>
                        </svg>
                    </button>
                </div>
                <>
                {currentView === 'login' && renderLoginForm()}
                {currentView === 'register' && renderRegisterForm()}
                {currentView === 'reset' && renderResetForm()}
                </>
            </div>
        </div>
    )
}

export default Authorization