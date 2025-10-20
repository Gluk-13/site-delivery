import express, { Router } from 'express';
const router = express.Router();
import pool from '../../config/db.js'

router.get('/', async (req, res) => {
    const userId = req.userId

    try {
        const dbResult = await pool.query('SELECT * FROM orders WHERE user_id = $1',[userId])

        return res.status(200).json({
            success: true,
            data: dbResult.rows
        })

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Ошибка подключения к серверу для просмотра заказов'
        })
    } 
})

router.post('/create', async (req, res) => {
    const userId = req.userId
    const {totalPrice, orderNumber, items, deliveryAddress, comment} = req.body
    let orderId;

    try {

        if (!items || !items.length) {
            return res.status(400).json({
                success: false,
                message: 'Нет товаров для добавления в корзину'
            })
        }
        const addOrders = await pool.query('INSERT INTO orders (user_id, order_number, total_amount, status, address, comment) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [userId, orderNumber, totalPrice, 'Новый', deliveryAddress, comment])
        if (!addOrders.rows[0].id) {
            return res.status(403).json({
                success: false,
                message: 'Ошибка в создании заказа'
            })
        }

        orderId = addOrders.rows[0].id;

        await pool.query(`
            INSERT INTO order_items (order_id, product_id, quantity) 
            SELECT $1, UNNEST($2::int[]), UNNEST($3::int[])
        `, [
            orderId, 
            items.map(item => item.productId), 
            items.map(item => item.quantity),    
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

router.get('/:orderId/items', async (req, res) => {
    const orderId = req.params.orderId;

    try {
        const itemsResult = await pool.query(
            `SELECT oi.* 
             FROM order_items oi 
             WHERE oi.order_id = $1`,
            [orderId]
        );

        return res.status(200).json({
            success: true,
            data: itemsResult.rows
        });

    } catch(error) {
        console.error('Error fetching order items:', error);
        return res.status(500).json({
            success: false,
            message: 'Ошибка сервера при получении товаров заказа'
        });
    }
});

router.patch('/status/:orderId', async (req, res) => {
    const orderId = req.params.orderId
    const status = req.body.status
    try {

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Новое значение статус не получено'
            })
        }

        const dbResult = await pool.query('UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',[status, orderId])

        if (dbResult.rowCount === 0) {
            return res.status(404).json({
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
