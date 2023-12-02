import { redisClient } from '../RedisCaching/server'
export async function updateCacheForReview() {
    redisClient.keys('*', (err, keys) => {
        if (err) {
            console.error(err)
            return
        }
        console.log('keys',keys)
    })
    await redisClient.del('paginateReview')
}