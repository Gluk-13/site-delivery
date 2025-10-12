import express, { Router } from 'express';
const router = express.Router();
import pool from '../../config/db.js'

router.get('/:userId', async (req, res) => {
    const userId = req.params.userId

    try {
        const dbResult = await pool.query('SELECT * FROM orders WHERE user_id = $1',[userId])
 
        if (!dbResult.rows[0]) {
            return res.status(401).json({
                success: false,
                message: 'Заказы этого пользователя не найдены' 
            })
        }

        return res.status(200).json({
            success: true,
            data: dbResult.rows[0]
        })

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Ошибка подключения к серверу для просмотра заказов'
        })
    } 
})

router.patch('/status/:userId', async (req, res) => {
    const userId = req.params.userId
    const status = req.body.status
    try {

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Новое значение статус не получено'
            })
        }

        const dbResult = await pool.query('UPDATE orders SET status = $1 WHERE user_id = $2 RETURNING *',[status, userId])

        if (dbResult.rowCount === 0) {
            return res.status(401).json({
                success: false,
                message: 'Ошибка в изменении статуса заказа'
            })
        }

        return res.status(200).json({
            success: true,
            message: `Статус заказа изменен на "${dbResult.rows[0].status}"`
        })

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Ошибка подключения к серверу для просмотра заказов'
        })
    } 
})

export default router;
