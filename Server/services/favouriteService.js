import redisClient from "../config/redisClient.js";

const getFavourKey = (userId) => `favour:${userId}`

class FavourService {
    async addItem(userId, productId, quantity = 1) {
        const key = getFavourKey(userId)
        await redisClient.hincrby(key, productId, quantity)
        return this.getFavourKey(userId)
    }

    async removeItem(userId, productId) {
        const key = getFavourKey(userId)

        await redisClient.hdel(key, productId)
        
        return this.getFavourKey(userId)
    }
}

export default new FavourService();
