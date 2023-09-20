import express, { Request, Response } from "express";
import { PrismaClient } from '.prisma/client';
import { baseQuery } from "../../utils/baseQuery"
import { redis } from "../../RedisConnection"
import { generateReviewCache } from "../../RedisConnection/GeneratedCache"
import { clause } from "../../utils/filterLogic"

const GetReviews = express.Router();
const prisma = new PrismaClient();

GetReviews.get("/", async (req: Request, res: Response) => {

    const { selectedTags, filterName, sortName }: string | any = req.query;
    const parsedTags = JSON.parse(selectedTags);
    const cacheKey = generateReviewCache(req);
    
    try {
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            return res.json(parsedData);
        } else {
    
            const whereClause = clause(filterName, parsedTags)
    
            const reviews = await prisma.review.findMany({
                where: whereClause,
                orderBy: [
                    sortName === 'asc' ? { name: 'asc' } : sortName === 'desc' ? { name: 'desc' } : {},
                ],
                ...baseQuery
            });
    
            await redis.set(cacheKey, JSON.stringify(reviews));
            res.json(reviews);
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching reviews.' });
    }
    
})

export { GetReviews };