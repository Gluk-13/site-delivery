import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../../config/db.js';

const router = express.Router();

router.put('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        //Проверяем email
        const checkEmailQuery = 'SELECT * FROM users WHERE email = $1';
        const emailResult = await pool.query(checkEmailQuery, [email]);

        if (emailResult.rows.length > 0) { //Проверка на уникальность почты
            return res.status(400).json({ message: 'Пользователь с такой почтой уже есть' });
        }

        //Хешируем пароль
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        //Хэшируем пароль по определенным раундам здесь 10

        //Вставляем данные
        const insertQuery = 'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id';
        const insertResult = await pool.query(insertQuery, [name, email, hashedPassword]);//Здесь интересная штука
        //Пишу не первый раз но не помню комментил ли уже,важно передавать значения именно таким образов
        //Это безопаснее и их нельзя перехватить

        res.status(201).json({
            message: 'Пользователь успешно создан',
            userId: insertResult.rows[0].id //Я пока не уверен, но вроде эти данные стоит отправлять обратно
            //на фронт потому что с ними потом можно манипулировать в визуальной части, + это поидеи безопасно
            //т.к. доступ получают после входа в личный кабинет(Хотя наверное по другому получить
            //информацию о юзере и отобразить ее для него и нельзя)
        });

    } catch (error) {
        console.error('Ошибка регистрации:', error); //Стандарт обработка ошибки на сервере
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
});

export default router;
