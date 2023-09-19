import { Request } from "express";

function generateReviewCache(req: Request) {
    const { selectedTags, groupName }: string | any = req.query;
    const endpoint = req.originalUrl;

    let cacheKey = `reviews:${endpoint}`;

    if (selectedTags) cacheKey += `:tags=${selectedTags}`;

    if (groupName !== "null") cacheKey += `:group=${groupName}`;
    return cacheKey;
}

function generateUserReviewCacheKey(req: Request) {
    const { userId, productId }: string | any = req.query;
    const endpoint = req.originalUrl;

    const cacheKey = `user-review:${endpoint}:userId=${userId}:productId=${productId}`;

    return cacheKey;
}

export { generateReviewCache, generateUserReviewCacheKey }