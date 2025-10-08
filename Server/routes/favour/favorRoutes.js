import express from 'express'
import { authenticateToken } from '../../middleware/auth.js'
import FavorController from '../../controllers/favoritesControllers.js'

const router = express.Router()

router.use(authenticateToken)

router.get('/', FavorController.getFavour)
router.post('/items', FavorController.addItem)
router.delete('/items/:productId', FavorController.removeItem)

export default router;
