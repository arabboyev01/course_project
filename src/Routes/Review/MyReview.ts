import express, { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import { authenticateUser } from "../../AuthUser/AuthenticateUser"
import { query } from "./query"
import { generateUserReviewCacheKey } from "../../RedisConnection/GeneratedCache"
import { redis } from "../../RedisConnection"
import { clause } from "../../utils/filterLogic"

const prisma = new PrismaClient();
const myReveiw = express.Router();

myReveiw.get('/', authenticateUser, async (req: Request | any, res: Response) => {
    const { selectedTags, filterName, sortName }: string | any = req.query;
    const cacheKey = generateUserReviewCacheKey(req)

    try {
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            return res.json(parsedData);
        } else {
            const isAdmin = await prisma.user.findUnique({ where: { id: req.user } });
            const whereClause = clause(filterName, JSON.parse(selectedTags))
            let reviews;

            if (isAdmin ?.userType === "ADMIN") {
                reviews = await prisma.review.findMany({
                    where: whereClause,
                    orderBy: [
                        sortName === 'asc' ? { name: 'asc' } : sortName === 'desc' ? { name: 'desc' } : {},
                    ],
                    ...query,
                });
            } else {
                reviews = await prisma.review.findMany({
                    where: {
                        AND: [
                            { userId: req.user },
                            whereClause
                        ]
                    },
                    orderBy: [
                        sortName === 'asc' ? { name: 'asc' } : sortName === 'desc' ? { name: 'desc' } : {},
                    ],
                    ...query,
                });
            }

            await redis.setex(cacheKey, 3600, JSON.stringify(reviews));
            await redis.del(cacheKey);

            return res.json(reviews);
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export { myReveiw }