import request from 'supertest';
import express from 'express';
import { jest, describe, expect, test, beforeEach } from '@jest/globals';

jest.resetModules();

jest.unstable_mockModule('../../config/db.js', () => ({
  default: {
    query: jest.fn(() => Promise.resolve({ rows: [] })) // Добавьте возвращаемое значение по умолчанию
  }
}));

jest.unstable_mockModule('pg', () => {
    const mockPool = {
        query: jest.fn(),
        connect: jest.fn(),
        end: jest.fn(),
        on: jest.fn(),
    };
    return {
        Pool: jest.fn(() => mockPool)
    };
});

const normalizeSQL = (sql) => {
  return sql.replace(/\s+/g, ' ').trim();
};

const { default: productsRouter } = await import('../../routes/products/products.js');
const { default: pool } = await import('../../config/db.js');

const app = express();
app.use(express.json());
app.use('/api/products', productsRouter);

describe('Products API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/products/bulk', () => {
    test('should return products for valid array of IDs', async () => {
      const mockProducts = [
        { id: 1, name: 'Блинчики', price: 50.50, discount_percent: 50 },
        { id: 2, name: 'Молоко', price: 140.50, discount_percent: 50 }
      ];
      
      pool.query.mockResolvedValue({ rows: mockProducts });

      const requestData = {
        ids: [1, 2, 3]
      };

      const response = await request(app)
        .post('/api/products/bulk')
        .send(requestData)
        .expect(200);

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(normalizeSQL(pool.query.mock.calls[0][0])).toBe(
        'SELECT * FROM products WHERE id = ANY($1::int[])',
        [[1, 2, 3]]
      );

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    test('should return 400 when ids is not an array', async () => {
      const invalidRequestData = {
        ids: 'not-an-array'
      };

      const response = await request(app)
        .post('/api/products/bulk')
        .send(invalidRequestData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Неверный формат запроса');
      expect(pool.query).not.toHaveBeenCalled();
    });

    test('should return empty array for empty ids array', async () => {
      const emptyRequestData = {
        ids: []
      };

      const response = await request(app)
        .post('/api/products/bulk')
        .send(emptyRequestData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(pool.query).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/products/new', () => {
    test('should return new products from last 30 days', async () => {
      const mockNewProducts = [
        { 
          id: 1, 
          name: 'Новый товар 1', 
          price: 100, 
          created_at: new Date().toISOString() 
        }
      ];
      pool.query.mockResolvedValue({ rows: mockNewProducts });

      const response = await request(app)
        .get('/api/products/new')
        .expect(200);

      expect(normalizeSQL(pool.query.mock.calls[0][0])).toBe(
        "SELECT * FROM products WHERE created_at >= CURRENT_DATE - INTERVAL '30 days' ORDER BY created_at DESC;"
      );
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockNewProducts);
    });
  });

  describe('GET /api/products/discounted', () => {
    test('should return products with discount', async () => {
      const mockDiscountedProducts = [
        { id: 1, name: 'Товар со скидкой', price: 100, discount_percent: 20 }
      ];
      pool.query.mockResolvedValue({ rows: mockDiscountedProducts });

      const response = await request(app)
        .get('/api/products/discounted')
        .expect(200);

      expect(normalizeSQL(pool.query.mock.calls[0][0])).toBe(
        'SELECT * FROM products WHERE discount_percent > 0'
      );
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockDiscountedProducts);
    });
  });
});