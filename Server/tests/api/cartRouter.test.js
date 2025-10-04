import request from 'supertest';
import { describe, jest, test, expect, beforeEach } from '@jest/globals';
import express from 'express'

jest.unstable_mockModule('../../services/cartService.js', () => ({
  default: {
    getCart: jest.fn(),
    addItem: jest.fn(),
    updateItem: jest.fn(),
    removeItem: jest.fn(),
    clearCart: jest.fn()
  }
}));

jest.unstable_mockModule('../../middleware/auth.js', () => ({
  authenticateToken: jest.fn((req, res, next) => {
    req.user = { userId: 'user123' };
    req.userId = 'user123';
    next();
  })
}));

const { default: cartRoutes } = await import('../../routes/cart/cartRoutes.js');
const { default: cartService } = await import('../../services/cartService.js');

describe('Cart API Routes', () => {
  let app;

  beforeEach(() => {

    app = express();
    app.use(express.json());
    app.use('/api/cart', cartRoutes);
    
    jest.clearAllMocks();
  });

  describe('GET /api/cart/', () => {
    test('should return user cart', async () => {
      const mockCart = [
        { id: '1', productId: '1', quantity: 2 }
      ];

      cartService.getCart.mockResolvedValue(mockCart);

      const response = await request(app)
        .get('/api/cart')
        .expect(200);

      expect(response.body).toEqual(mockCart);
      expect(cartService.getCart).toHaveBeenCalledWith('user123');
    });
  })
});