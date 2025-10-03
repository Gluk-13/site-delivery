import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../../config/db.js';

const router = express.Router();

router.post('/login', async (req, res) => { //Пишем эндпоинт 
    const {email, password} = req.body; //Диструктуризация переменных из фетч запроса
    try {

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Не введен email или пароль'
            })
        }

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

        if (!result) {
            return res.status(401).json({
                success: false,
                message: 'Неверный логин или пароль'
            });
        }

        const { id: dbUserId, name: dbUserName, email: dbUserEmail} = dbResult.rows[0];
        const JWT_SECRET = process.env.JWT_SECRET || 'секретный_код';

        const token = jwt.sign(
            {userId: dbUserId},
            JWT_SECRET,
            {expiresIn: '2h'}
        )

        res.status(200).json({
            success: true,
            token,
            user: {
                id: dbUserId,
                email: dbUserEmail,
                userName: dbUserName
            }
        })
        

    } catch(error) {
        console.error('Ошибка сервера при авторизации',error)
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        })
    }
});

export default router;
