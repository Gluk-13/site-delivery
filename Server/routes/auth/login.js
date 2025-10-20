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

        if (!dbResult.rows[0]) {
            return res.status(401).json({
                success: false,
                message: 'Неверный логин или пароль'
            });
        }
        
        const dbPassword = dbResult.rows[0].password_hash 
        const result = await bcrypt.compare(password, dbPassword);

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
            {expiresIn: '10h'}
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

router.put('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(402).json({
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

router.post('/refresh',async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Токен не отправлен' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });

        const newToken = jwt.sign(
            { userId: decoded.userId },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token: newToken });

    } catch (error) {
        res.status(403).json({ message: 'Невалидный токен' });
    }
})

router.post('/logout', (req, res) => {
  try {
    
    res.json({ 
      success: true, 
      message: 'Успешный выход' 
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка выхода' 
    });
  }
});

export default router;
