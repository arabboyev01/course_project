import { Request } from "express";
import { v4 as uuidv4 } from 'uuid';

function generateReviewCache(req: Request) {
    const { selectedTags, groupName }: string | any = req.query;
    const selectedTagsString = JSON.stringify(selectedTags);
    const filteredGroup = groupName !== "null" ? groupName : "null";
    
    const uniqueKey = uuidv4();
    
    const endpointPath = req.originalUrl.split('?')[0];
    
    let cacheKey = `${endpointPath}?selectedTags=${selectedTagsString}&groupName=${filteredGroup}&uuid=${uniqueKey}`;
    
    return cacheKey;

}

function generateUserReviewCacheKey(req: Request|any) {
    const { productId }: string | any = req.query;
    const endpoint = req.originalUrl;

    const cacheKey = `user-review:${endpoint}:userId=${req.user}:productId=${productId}`;

    return cacheKey;
}

function generateSingleReviewCacheKey(id: number|any) {
    
    const cacheKey = `review:${id}`;
    
    return cacheKey;
}

export { generateReviewCache, generateUserReviewCacheKey, generateSingleReviewCacheKey }