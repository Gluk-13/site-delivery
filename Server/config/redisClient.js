import dotenv from 'dotenv';
import Redis from 'ioredis';

dotenv.config();

let redisClientInstance = null;

const getRedisClient = () => {
  if (!redisClientInstance) {
    redisClientInstance = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      connectTimeout: 1000,
      retryStrategy: (times) => Math.min(times * 50, 3000)
    });

    redisClientInstance.on('connect', () => {
      console.log('Redis успешно подключён!');
    });

    redisClientInstance.on('error', (err) => {
      console.error('Ошибка подключения к Redis:', err);
    });
  }
  
  return redisClientInstance;
};

export default getRedisClient;