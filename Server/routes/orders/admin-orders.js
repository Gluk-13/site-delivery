import express, { Router } from 'express';
const router = express.Router();
import pool from '../../config/db.js'

router.get('/admin/orders', async (req, res) => {
    try {
        const userId = req.userId

        if(!userId) {
            return res.status(401).json({
                success: false,
                message: 'Пользователь не авторизован'
            })
        }

        const result = await pool.query(`
            SELECT 
                orders.id,
                orders.status,
                orders.total_amount,
                orders.created_at,
                users.email,
                users.name,
                COUNT(order_items.id) as items_count
            FROM orders
            LEFT JOIN users ON orders.user_id = users.id
            LEFT JOIN order_items ON orders.id = order_items.order_id
            WHERE orders.status != 'delivered' AND orders.status != 'cancelled'
            GROUP BY orders.id, users.email, users.name
            ORDER BY 
                CASE orders.status
                    WHEN 'pending' THEN 1
                    WHEN 'confirmed' THEN 2  
                    WHEN 'processing' THEN 3
                    WHEN 'shipped' THEN 4
                    ELSE 5
                END,
                orders.created_at DESC
        `);


        res.json({
            success: true,
            orders: result.rows
        });

    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Не удалось загрузить заказы' 
        });
    }
});