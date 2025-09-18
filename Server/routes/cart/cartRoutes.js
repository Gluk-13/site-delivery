import express from 'express'
import { authenticateToken } from '../../middleware/auth.js'
import cartController from '../../controllers/cartControllers.js'

const router = express.Router()

router.use(authenticateToken)

router.get('/', cartController.getCart)
router.post('/items', cartController.addItem)
router.put('/items/:productId', cartController.updateItem)
router.delete('/items/:productId', cartController.removeItem)
router.delete('/',cartController.clearCart)

export default router;