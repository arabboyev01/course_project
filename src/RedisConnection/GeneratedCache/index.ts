import { Request } from "express";
import crypto from "crypto"

function generateReviewCache(params: any) {

    const normalizedParams: any = {};
    
    for (const key in params) {
        if (params[key] === "null" || params[key] === "") {
            normalizedParams[key] = "empty";
        } else {
            normalizedParams[key] = params[key];
        }
    }
    
    const keyData = JSON.stringify(normalizedParams);
    
    const uniqueKey = crypto.createHash('md5').update(keyData).digest('hex');
    
    return uniqueKey;
    
}

function generateUserReviewCacheKey(req: Request | any) {
    const { productId }: string | any = req.query;
    const endpoint = req.originalUrl;

    const cacheKey = `user-review:${endpoint}:userId=${req.user}:productId=${productId}`;

    return cacheKey;
}

function generateSingleReviewCacheKey(id: number) {

    const cacheKey = `/api/single-review?id=${id}`;

    return cacheKey;
}

function generateRatingCache(reviewId: number, userId: number) {
    const cacheKey = `/api/ratings?reviewId=${reviewId}&userId=${userId}`;

    return cacheKey;
}

export { generateReviewCache, generateUserReviewCacheKey, generateSingleReviewCacheKey, generateRatingCache }