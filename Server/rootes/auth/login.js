import { authenticateToken } from '../../middleware/auth.js'
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../../db.js'; //Пул подключения к PostgreSQL

const router = express.Router();

router.post('/login', async (req, res) => { //Пишем эндпоинт 
    const {email, password} = req.body; //Диструктуризация переменных из фетч запроса
    try {

        const dbResult = await pool.query('SELECT * FROM users WHERE email = $1',[email])
            //Безопасно проверяем по почте есть ли вообще такой юзер
        if (!dbResult.rows[0]) {
            return res.status(401).json({//Если его нет то ошибка и сообщение юзеру
                success: false,
                message: 'Неверный логин или пароль'
            });
        }

        const dbPassword = dbResult.rows[0].password_hash //Пароль найденного юзера
        const result = await bcrypt.compare(password, dbPassword); //Сверяем пароль и хэш в бд
        const JWT_SECRET = process.env.JWT_SECRET || 'секретный_код';// Подписываем ответ токеном
        //Либо из .env либо стандарт
        const { id: dbUserId, name: dbUserName, email: dbUserEmail} = dbResult.rows[0];
        //Диструктуризировали переменные из бд по найденному юзеру
        if (!result) {
            return res.status(401).json({
                success: false,
                message: 'Неверный логин или пароль'
            });
        }

        if (result) { //Здесь цикл уже необязательный т.к. если пароли не совпали то досюда никогда
            //не дойдет код
            const token = jwt.sign( //Создаем токен и передаем его в response
                {userId: dbUserId},
                JWT_SECRET,
                {expiresIn: '10h'}
            )
            res.json({
                success: true,
                token,
                user: {
                    id: dbUserId,
                    email: dbUserEmail,
                    userName: dbUserName
                }
            })
        }

    } catch(error) {
        console.error('Ошибка сервера при авторизации',error)
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        })
    }
});

export default router;