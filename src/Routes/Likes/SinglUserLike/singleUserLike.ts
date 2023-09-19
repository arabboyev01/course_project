import express, { Response, Request } from 'express';
import { PrismaClient } from '@prisma/client'
import { authenticateUser } from "../../../AuthUser/AuthenticateUser"
import { baseQuery } from "../../../utils/baseQuery"
const prisma = new PrismaClient();
const singleUserLike = express.Router();

singleUserLike.get("/", authenticateUser, async (req: Request | any, res: Response) => {
    if (req.user) {
        try {
            const likes = await prisma.like.findMany({
                where: { userId: req.user.id },
            });

            const reviewIds = likes.map((like) => like.reviewId);

            const reviews = await prisma.review.findMany({
                where: { id: { in: reviewIds } },
                ...baseQuery,
            });

            res.status(200).json(reviews);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while fetching data' });
        }
    } else {
        res.status(401).json({ error: 'Unauthorized user' });
    }
})

export { singleUserLike }