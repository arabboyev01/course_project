import Redis from 'ioredis'

const redisOptions = {
    host: 'redis-10c6109b-abbosarabboyev9-a58a.a.aivencloud.com',
    port: 10155,
    password: 'AVNS_8d6UYaY51ncxo7w08v8',
    tls: {
        rejectUnauthorized: false,
    },
}

export const redisClient = new Redis(redisOptions)
redisClient.on('error', err => console.log('Redis Client Error', err))