import getRedisClient from "../config/redisClient.js";

const getCartKey = (userId) => `cart:${userId}`


class CartService {
    async addItem(userId, productId, quantity = 1) {
        const redisClient = getRedisClient();
        const key = getCartKey(userId)

        const item = {
            productId,
            quantity
        };

        await redisClient.hset(key, productId, JSON.stringify(item));
        return this.getCart(userId);
    }

    async getCart(userId) {
        const redisClient = getRedisClient();
        const key = getCartKey(userId)

        const cart = await redisClient.hgetall(key) 

        return Object.entries(cart).map(([productId, itemJson]) => {
            const item = JSON.parse(itemJson);
            return {
                id: productId,
                productId: item.productId,
                quantity: item.quantity
            };
        });
    }

    async updateItem(userId, productId, newQuantity) {
        const redisClient = getRedisClient();
        const key = getCartKey(userId);
        
        if (newQuantity <= 0) {
            await this.removeItem(userId, productId);
        } else {
            const item = {
                productId,
                quantity: newQuantity
            };
            await redisClient.hset(key, productId, JSON.stringify(item));
        }
        
        return this.getCart(userId);
    }

    async removeItem(userId, productId) {
        const redisClient = getRedisClient();
        const key = getCartKey(userId);

        await redisClient.hdel(key, productId)
        
        return this.getCart(userId);
    }

    async clearCart(userId) {
        const redisClient = getRedisClient();
        const key = getCartKey(userId)

        await redisClient.del(key) 
    }
}

export default new CartService();