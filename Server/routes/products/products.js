import express from 'express';
const router = express.Router();
import pool from '../../db.js';


router.get('/new', async (req,res)=>{
    try {
        const query = `SELECT * FROM products WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
        ORDER BY created_at DESC;`
        const dbNewProduct = await pool.query(query);
        const newProduct = dbNewProduct.rows

        res.json({
            success: true,
            data: newProduct
        })

    } catch {
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