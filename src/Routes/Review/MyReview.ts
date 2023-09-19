import express, { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import { authenticateUser } from "../../AuthUser/AuthenticateUser"
import { query } from "./query"
import { generateUserReviewCacheKey } from "../../RedisConnection/GeneratedCache"
import { redis } from "../../RedisConnection"

const prisma = new PrismaClient();
const myReveiw = express.Router();

myReveiw.get('/', authenticateUser, async (req: Request | any, res: Response) => {

    const userId = req.user;
    const cacheKey = generateUserReviewCacheKey(req);
    
    try {
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            return res.json(parsedData);
        } else {
        
            const isAdmin = await prisma.user.findUnique({
                where: { id: userId },
            });

            let reviews;

            if (isAdmin ?.userType === "ADMIN") {
                reviews = await prisma.review.findMany({
                    ...query,
                });
            } else {
                reviews = await prisma.review.findMany({
                    where: { userId },
                    ...query,
                });
            }

            await redis.setex(cacheKey, 3600, JSON.stringify(reviews));

            return res.json(reviews);
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


export { myReveiw }