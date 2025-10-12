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

router.post('/add/:userId', async (req, res) => {
    const userId = req.params.userId
    const {totalPrice, orderNumber, items} = req.body
    let orderId;

    try {

        if (!items || !items.length) {
            return res.status(400).json({
                success: false,
                message: 'Нет товаров для добавления в корзину'
            })
        }
        const addOrders = await pool.query('INSERT INTO orders (user_id, order_number, total_amount, status) VALUES ($1, $2, $3, $4) RETURNING id',
            [userId, orderNumber, totalPrice, 'pending'])
        if (!addOrders.rows[0].id) {
            return res.status(403).json({
                success: false,
                message: 'Ошибка в создании заказа'
            })
        }

        orderId = addOrders.rows[0].id;

        await pool.query(`
            INSERT INTO order_items (order_id, product_id, quantity, price) 
            SELECT $1, UNNEST($2::int[]), UNNEST($3::int[]), UNNEST($4::decimal[])
        `, [
            orderId, 
            items.map(item => item.productId), 
            items.map(item => item.quantity),     
            items.map(item => item.price)      
        ]);

        return res.status(200).json({
            success: true,
            message: 'Заказ успешно создан'
        })
    } catch (error) {
        if (orderId) {
            await pool.query('DELETE FROM orders WHERE id = $1',[orderId])
        }

        return res.status(500).json({
            success: false,
            message: 'Ошибка подключения к бд при создании заказа'
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
