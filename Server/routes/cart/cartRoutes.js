import express from 'express'
import { authenticateToken } from '../../middleware/auth.js'
import cartController from '../../controllers/cartControllers.js'

const router = express.Router()

router.use(authenticateToken)

router.get('/', cartController.getCart)
router.post('/items', cartController.addItem)
router.delete('/items/:productId', cartController.removeItem)

export default router;
