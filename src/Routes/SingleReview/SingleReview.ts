import express, { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import { baseQuery } from '../../utils/baseQuery';
import { redis } from "../../RedisConnection"
import { generateReviewCache } from "../../RedisConnection/GeneratedCache"
const prisma = new PrismaClient();
const singleReview = express.Router();

singleReview.get('/', async (req: Request, res: Response): Promise<any> => {
    const id = req.query.id;

    try {
        if (!id) {
            return res.status(400).json({ message: 'ID parameter is missing in the request.' });
        }

        const reviewId = parseInt(id as string);
        const cacheKey = generateReviewCache(req);

        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            return res.json(parsedData);
        }

        const review = await prisma.review.findUnique({
            where: { id: reviewId },
            ...baseQuery
        });

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        await redis.setex(cacheKey, 3600, JSON.stringify(review));

        return res.json(review);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});


export { singleReview }