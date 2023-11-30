import { redisClient } from '../RedisCaching/server'
export async function updateCacheForReview(reviewId: string) {
    const deleted = await redisClient.del('paginateReview')
    console.log(deleted)
    const keyExists = await redisClient.exists(`paginateReview:${reviewId}`)
    
    if (keyExists === 1) {
        console.log('Key exists')
    } else {
        console.log('Key does not exist')
    }
}