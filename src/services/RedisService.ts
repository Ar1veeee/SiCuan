import redisClient from '../config/redis.config';

export class RedisService {
    async get(key: string): Promise<string | null> {
        return await redisClient.get(key);
    }

    async set(key: string, value: string, expiry: number = 3600): Promise<'OK'> {
        return await redisClient.set(key, value, 'EX', expiry);
    }

    async del(key: string): Promise<number> {
        return await redisClient.del(key);
    }
}

export default new RedisService();