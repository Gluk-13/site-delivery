import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../../config/db.js';

const router = express.Router();

router.patch('/reset',async (req, res) => {
    try {
        const { email, password} = req.body
        const checkEmailQuery = 'SELECT * FROM users WHERE email = $1';
        const emailCheckDb = await pool.query(checkEmailQuery, [email])

        if (!emailCheckDb) {
            return res.status(401).json({ message: 'Пользователь с этой почтой не найден'})
        }

        const hashNewPassword = await bcrypt.hash(password);
        const newPasswordPushQuery = 'UPDATE users SET password_hash = $2 WHERE email = $1'
        const newPasswordPushDb = await pool.query(newPasswordPushQuery, [email, password])
    } catch {
        if (error) {
            return res.status(501).json({
                message: `${error}:Ошибка на сервере`
            })
        }
    }
})

export default router;
