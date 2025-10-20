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
        const query = `SELECT * FROM products WHERE created_at >= CURRENT_DATE - INTERVAL '100 days'
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

router.get('/category/:categoryName', async (req, res) => {
  try {
    const { categoryName } = req.params;
    
    if (!categoryName) {
        return res.json({
            success: false,
            message: 'Категория невалидна'
        })
    }
    
    const products = await pool.query(
      'SELECT * FROM products WHERE category = $1',
      [categoryName]
    );

    if (products.rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'Продукты по этой категории не найдены'
        })
    }
    
    res.status(200).json({
        success: true,
        products: products.rows,
    });

  } catch (error) {
    console.error('Ошибка при получении товаров:', error);
    res.status(500).json({ error: 'Ошибка подключения к бд' });
  }
});

export default router;
