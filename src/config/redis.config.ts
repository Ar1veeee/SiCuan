import Redis from 'ioredis';

const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USER,
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
  });

export default redisClient;