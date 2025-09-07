import { authenticateToken } from '../../middleware/auth.js'
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../../db.js'; //Пул подключения к PostgreSQL

const router = express.Router();

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {

        const dbResult = await pool.query('SELECT * FROM users WHERE email = $1',[email])

        if (!dbResult.rows[0]) {
            return res.status(401).json({
                success: false,
                message: 'Неверный логин или пароль'
            });
        }

        const dbPassword = dbResult.rows[0].password_hash
        const result = await bcrypt.compare(password, dbPassword);
        const JWT_SECRET = process.env.JWT_SECRET || 'секретный_код';
        const { id: dbUserId, name: dbUserName, email: dbUserEmail} = dbResult.rows[0];

        if (!result) {
            return res.status(401).json({
                success: false,
                message: 'Неверный логин или пароль'
            });
        }

        if (result) {
            const token = jwt.sign(
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