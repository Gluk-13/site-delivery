import dotenv from 'dotenv';
import Redis from 'ioredis';

dotenv.config();

let redisClientInstance = null;

const createRedisClient = () => {
  const redisConfig = {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    connectTimeout: 5000,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 2,
    lazyConnect: true,
    showFriendlyErrorStack: true,
  };

  if (process.env.REDIS_PASSWORD) {
    redisConfig.password = process.env.REDIS_PASSWORD;
  }

  return new Redis(redisConfig);
};

const getRedisClient = () => {
  if (!redisClientInstance) {
    redisClientInstance = createRedisClient();
    
    redisClientInstance.on('connect', () => {
      console.log('Redis клиент подключён');
    });
    
    redisClientInstance.on('error', (err) => {
      console.error('Redis ошибка:', err.message);
    });
  }
  
  return redisClientInstance;
};

export const testRedisConnection = async () => {
  try {
    const client = getRedisClient();
    await client.ping();
    console.log('Redis доступен');
    return true;
  } catch (error) {
    console.error('Redis недоступен:', error.message);
    return false;
  }
};

export default getRedisClient;
