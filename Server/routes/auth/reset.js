import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../../config/db.js';

const router = express.Router();

router.patch('/reset',async (req, res) => {
    try {
        const { email, password} = req.body

        if (!password || !email) {
            return res.status(400).json({
                success: false,
                message: 'Не введен пароль или email'
            })
        }

        const checkEmailQuery = 'SELECT * FROM users WHERE email = $1';
        const emailCheckDb = await pool.query(checkEmailQuery, [email])

        if (emailCheckDb.rows.length === 0) {
            return res.status(401).json({ 
                success: false,
                message: 'Пользователь с этой почтой не найден'
            })
        }

        const hashNewPassword = await bcrypt.hash(password, 10);
        const newPasswordPushQuery = 'UPDATE users SET password_hash = $2 WHERE email = $1'
        const newPasswordPushDb = await pool.query(newPasswordPushQuery, [email, hashNewPassword])

        res.status(200).json({
            success: true,
            message: 'Пароль успешно изменен'
        })

    } catch (error) {
        console.error('Ошибка при обновлении пароля', error)
        if (error) {
            return res.status(500).json({
                success: false,
                message: 'Ошибка на сервере'
            })
        }
    }
})

export default router;
