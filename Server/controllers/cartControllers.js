import cartService from "../services/cartService.js";

class CartController {
    async getCart(req, res, next) {
        try {
            const userId = req.user.id
            const cart = await cartService.getCart(userId)
            res.json(cart)
        } catch (error) {
            next(error)
        }
    }
    async addItem(req, res, next) {
        try {
            const userId = req.user.id
            const { productId, quantity } = req.body
            const updatedCart = await cartService.addItem(userId, productId, quantity)
            res.json(updatedCart)
        } catch (error) {
            next(error)
        }
    }
    async updateItem(req, res, next) {
        try {
            const userId = req.user.id
            const {newQuantity, productId} = req.body
            const updatedCart = await cartService.updateItem(userId, productId, newQuantity)
            res.json(updatedCart)
        } catch (error) {
            next(error)
        }
    }
    async removeItem(req, res, next) {
        try {
            const userId = req.user.id
            const { productId } = req.body
            const updatedCart = await cartService.removeItem(userId, productId)
            res.json(updatedCart)
        } catch (error) {
            next(error)
        }
    }
    async clearCart(req, res, next) {
        try {
            const userId = req.user.id
            await cartService.clearCart(userId)
            res.json([])
        } catch (error) {
            next(error)
        }
    }
}

export default new CartController