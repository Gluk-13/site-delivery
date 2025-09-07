import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../../db.js'; // Пул PostgreSQL

const router = express.Router();

router.put('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // 1. Проверяем email
        const checkEmailQuery = 'SELECT * FROM users WHERE email = $1';
        const emailResult = await pool.query(checkEmailQuery, [email]);

        if (emailResult.rows.length > 0) {
            return res.status(400).json({ message: 'Пользователь с такой почтой уже есть' });
        }

        // 2. Хешируем пароль
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 3. Вставляем данные
        const insertQuery = 'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id';
        const insertResult = await pool.query(insertQuery, [name, email, hashedPassword]);

        res.status(201).json({
            message: 'Пользователь успешно создан',
            userId: insertResult.rows[0].id // Для PostgreSQL берем из rows[0]
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