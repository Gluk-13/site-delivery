import favouriteService from '../services/favouriteService.js'

class FavourController {
    async getFavour(req, res, next) {
        try {
            const userId = req.user.id
            const favour = await favouriteService.getFavour(userId)
            res.json(favour)
        } catch (error) {
            next(error)
        }
    }

    async addItem(req, res, next) {
        try {
            const userId = req.user.id
            const { productId, quantity } = req.body
            const updatedFavour = await favouriteService.addItem(userId, productId, quantity)
            res.json(updatedFavour)
        } catch (error) {
            next(error)
        }
    }

    async removeItem(req, res, next) {
        try {
            const userId = req.user.id
            const { productId } = req.body
            const updatedFavour = await favouriteService.removeItem(userId, productId)
            res.json(updatedFavour)
        } catch (error) {
            next(error)
        }
    }
}

export default new FavourController
