import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../../config/db.js';

const router = express.Router();

router.put('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(401).json({
                success: false,
                message: 'Не введет пароль, почта или имя'
            })
        }

        const checkEmailQuery = 'SELECT * FROM users WHERE email = $1';
        const emailResult = await pool.query(checkEmailQuery, [email]);

        if (emailResult.rows.length > 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Пользователь с такой почтой уже есть',
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const insertQuery = 'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id';
        const insertResult = await pool.query(insertQuery, [name, email, hashedPassword]);

        res.status(200).json({
            success: true,
            message: 'Пользователь успешно создан',
            userId: insertResult.rows[0].id 
        });

    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
});

export default router;
