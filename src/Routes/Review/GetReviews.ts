import express, { Request, Response } from "express";
import { PrismaClient } from '.prisma/client';
import { baseQuery } from "../../utils/baseQuery"
import { redis } from "../../RedisConnection"
import { generateReviewCache } from "../../RedisConnection/GeneratedCache"

const GetReviews = express.Router();
const prisma = new PrismaClient();

GetReviews.get("/", async (req: Request, res: Response) => {

    const { selectedTags, groupName }: string | any = req.query;
    const parsedTags = JSON.parse(selectedTags);
    const cacheKey = generateReviewCache(req);

    try {
        const reviews = await prisma.review.findMany({
            where: {
                AND: [
                    groupName !== "null" ? { groupName } : {},
                    parsedTags && parsedTags.length > 0
                        ? {
                            tags: {
                                some: {
                                    name: {
                                        in: parsedTags,
                                    },
                                },
                            },
                        }
                        : {},
                ],
            },
            ...baseQuery,
        });
    
        await redis.set(cacheKey, JSON.stringify(reviews));
        res.json(reviews);
        
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching reviews.' });
    }
    
})

export { GetReviews };