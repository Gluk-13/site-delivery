import getRedisClient from "../config/redisClient.js";

const getFavoriteKey = (userId) => `favorites:${userId}`;

class FavoriteService {
    async getFavor(userId) {
        try {
            const redisClient = getRedisClient();
            const key = getFavoriteKey(userId);
            
            const favoritesData = await redisClient.get(key);
            
            return favoritesData ? JSON.parse(favoritesData) : [];
        } catch (error) {
            return [];
        }
    }

    async addItem(userId, productId) {
        try {
            const redisClient = getRedisClient();
            
            const favorites = await this.getFavor(userId);
            
            if (!favorites.includes(productId)) {
                favorites.push(productId);
                await redisClient.set(getFavoriteKey(userId), JSON.stringify(favorites));
            }
            
            return favorites;
        } catch (error) {
            throw error;
        }
    }

    async removeItem(userId, productId) {
        try {
            const redisClient = getRedisClient();
            const key = getFavoriteKey(userId)
            
            const favorites = await this.getFavor(userId);

            const productIdNum = Number(productId);
            const updatedFavorites = favorites.filter(id => Number(id) !== productIdNum);
            
            await redisClient.set(key, JSON.stringify(updatedFavorites));
            
            return updatedFavorites;
        } catch (error) {
            throw error;
        }
    }
}

export default new FavoriteService();
