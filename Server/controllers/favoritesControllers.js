import favoriteService from '../services/favoriteService.js'

class FavorController {
    async getFavour(req, res, next) {
        try {
            const userId = req.userId;
            const favorites = await favoriteService.getFavor(userId)
            if (!userId) {
                return res.status(400).json({ error: 'Не передан ID пользователя' });
            }
            res.json(favorites || [])
        } catch (error) {
            next(error)
        }
    }

    async addItem(req, res, next) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(400).json({ error: 'Не передан ID пользователя' });
            }
            const { productId } = req.body
            const updatedFavorites = await favoriteService.addItem(userId, productId)
            res.json(updatedFavorites || [])
        } catch (error) {
            next(error)
        }
    }

    async removeItem(req, res, next) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(400).json({ error: 'Не передан ID пользователя' });
            }
            const { productId } = req.params
            const updatedFavorites = await favoriteService.removeItem(userId, productId)
            res.json(updatedFavorites || [])
        } catch (error) {
            next(error)
        }
    }
}

export default new FavorController();
