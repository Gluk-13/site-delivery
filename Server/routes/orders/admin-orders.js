import express, { Router } from 'express';
const router = express.Router();
import pool from '../../config/db.js'

router.get('/admin', async (req, res) => {
    try {
        console.log('🔐 Admin user:', req.userId, req.userRole);

        const result = await pool.query(`
            SELECT 
                o.id,
                o.status,
                o.total_amount,
                o.created_at,
                o.address,
                o.comment,
                o.order_number,
                u.email,
                u.name,
                COUNT(oi.id) as items_count,
                SUM(oi.quantity) as total_items
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            LEFT JOIN order_items oi ON o.id = oi.order_id
            GROUP BY o.id, u.email, u.name
            ORDER BY 
                CASE o.status
                    WHEN 'Новый' THEN 1
                    WHEN 'Собран' THEN 2  
                    WHEN 'Доставляется' THEN 3
                    WHEN 'Возврат' THEN 4
                    WHEN 'Вернули' THEN 5
                    WHEN 'Закрыт' THEN 6
                    ELSE 7
                END,
                o.created_at DESC
        `);

        console.log('📊 Found orders:', result.rows.length);
        console.log('📊 Sample order:', result.rows[0]);

        res.json({
            success: true,
            orders: result.rows
        });

    } catch (error) {
        console.error('❌ Admin orders error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Не удалось загрузить заказы' 
        });
    }
});

export default router; 