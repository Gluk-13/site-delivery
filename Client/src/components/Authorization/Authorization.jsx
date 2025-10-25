import React, { useState } from 'react'
import styles from './Authorization.module.scss'
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore'


const Authorization = () => {
    const navigate = useNavigate();
    const { 
        login, 
        register, 
        resetPassword, 
        isLoading,
        error, 
        clearError 
    } = useAuthStore();
    const [message, setMessage] = useState(''); 
    const [currentView, setCurrentView] = useState('login');
    const [loginData, setLoginData] = useState({ email: '', password: ''})
    const [registerData, setRegisterData] = useState({ 
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [resetData, setResetData] = useState({ email: '', password: '', confirmPassword: ''});

    const handleViewChange = (view) => {
        setCurrentView(view);
        setMessage('');
        clearError();
    };

    const handleCancelAuth = () => {
        navigate('/');
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        clearError();

        const result = await login(loginData.email, loginData.password);
        
        if (result.success) {
            navigate('/');
        } else {
            setMessage(result.message || 'Ошибка входа');
        }
    };

    const renderLoginForm = () => (
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
                disabled={isLoading}
                className={styles.authorization__btn_primary}
                >
                    {isLoading ? 'Вход...' : 'Войти'}
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
        setMessage('');
        clearError();

        const result = await register(
            registerData.email,
            registerData.password,
            registerData.name,
            registerData.confirmPassword,
        );

        if (result.success) {
            setMessage(result.message);
            setTimeout(() => {
                setCurrentView('login');
                setMessage('');
            }, 2000);
        } else {
            setMessage(result.message);
        }
    };

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
                disabled={isLoading}
                className={styles.authorization__btn_primary}
                >
                    {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
            <div className={styles.authorization__password_btn}>
                <button 
                    type='button'
                    className={styles.authorization__register_btn}
                    onClick={() => handleViewChange('login')}
                    >
                        Назад
                </button>
                <button 
                    type='button'
                    className={styles.authorization__recover_btn}
                    onClick={() => handleViewChange('reset')}
                    >
                        Забыли пароль?
                </button>
            </div>
        </form>
    )

    const handleReset = async (e) => {
        e.preventDefault();
        setMessage('');
        clearError();

        const result = await resetPassword(
            resetData.email,
            resetData.password,
            resetData.confirmPassword
        );

        if (result.success) {
            setMessage(result.message);
            setCurrentView('login')
        } else {
            setMessage(result.message);
        }
    };

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
                disabled={isLoading}
                className={styles.authorization__btn_primary}
                >
                    {isLoading ? 'Сохранение...' : 'Сохранить'}
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
                    <button className={styles.authorization__cancel_btn}
                    onClick={handleCancelAuth}
                    >
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