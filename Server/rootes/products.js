const express = require('express');
const router = express.Router();
const pool = require('../db');


router.get('/discounted', async (req, res) => {
    try {
        const query = `SELECT * FROM products WHERE discount_percent = TRUE`;
        const result = await pool.query(query);
        
        res.json({
            success: true,
            data: result.rows,
            count: result.rows.length
        });
    } catch (error) {
        console.error('Ошибка в получении товаров:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера при получении товаров'
        });
    }
});

module.exports = router;