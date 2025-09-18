import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config()

const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
})

redisClient.on('', (err) => {
    console.error('Redis не работает проблемы с подключением',err)
})

redisClient.on('connect', () => {
    console.log('Redis подключен!')
})

export default redisClient;