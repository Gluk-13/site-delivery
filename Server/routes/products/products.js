import express from 'express';
const router = express.Router();
import pool from '../../config/db.js'

router.post('/bulk', async (req, res) => {
    const { ids } = req.body;
    
    try {
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({
                success: false,
                message: 'Неверный формат запроса: ожидается массив ids в теле запроса'
            })
        }

        if (ids.length === 0) {
            return res.json({
                success: true,
                data: []
            })
        }

        if (ids.some(id => isNaN(parseInt(id)))) {
            return res.status(400).json({
                success: false,
                message: 'Неверный формат IDs: все элементы должны быть числами'
            })
        }

        const query = `
        SELECT * FROM products 
        WHERE id = ANY($1::int[])
        `

        const dbQuery = await pool.query(query, [ids])

        res.status(200).json({
            success: true,
            data: dbQuery.rows
        })
        
    } catch (error) {
        console.error('Ошибка в POST /api/products/bulk:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера при получении товаров'
        })
    }
})

router.get('/new', async (req, res) => {
    try {
        const query = `SELECT * FROM products WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
        ORDER BY created_at DESC;`
        const dbNewProduct = await pool.query(query);
        const newProduct = dbNewProduct.rows

        res.json({
            success: true,
            data: newProduct
        })

    } catch (error) {
        console.error('Ошибка в получении товаров:', error)
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера при получении товаров'
        })
    }
})

router.get('/discounted', async (req, res) => {
    try {
        const query = `SELECT * FROM products WHERE discount_percent > 0`;
        const dbProductDiscount = await pool.query(query);
        const productDiscount = dbProductDiscount.rows

        res.json({
            success: true,
            data: productDiscount,
        });
    } catch (error) {
        console.error('Ошибка в получении товаров:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера при получении товаров'
        });
    }
});

export default router;
