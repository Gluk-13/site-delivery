import redisClient from "../config/redisClient.js";

const getCartKey = (userId) => `cart:${userId}`

class CartService {
    async addItem(userId, productId, quantity = 1) {
        const key = getCartKey(userId)
        await redisClient.hincrby(key, productId, quantity);
        return this.getCart(userId);
    }

    async getCart(getCartKey) {
        const key = getCartKey(userId)
        const cart = await redisClient.hGetAll(key) 
        return Object.entries(cart).map(([productId, quantity]) => ({
            productId,
            quantity: parseInt(quantity, 10),
        }));
    }

    async updateItem(userId, productId, newQuantity) {
        const key = getCartKey(userId)
        if (newQuantity <= 0) {
            await this.redisClient.removeItem(userId, productId)
        } else {
            await redisClient.hset(key, productId, newQuantity)
        }
        return this.getCart(userId);
    }

    async removeItem(userId, productId) {
        const key = getCartKey(userId);

        await redisClient.hDel(key, productId)
        
        return this.getCart(userId);
    }

    async clearCart(userId) {
        const key = getCartKey(userId)

        await redisClient.del(key) 
    }
}

export default new CartService();