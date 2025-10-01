import express from 'express'
import { authenticateToken } from '../../middleware/auth.js'
import FavourController from '../../controllers/favouritesControllers.js'

const router = express.Router()

router.use(authenticateToken)

router.get('/', FavourController.getFavour)
router.post('/items', FavourController.addItem)
router.delete('/items/:productId', FavourController.removeItem)

export default router;
