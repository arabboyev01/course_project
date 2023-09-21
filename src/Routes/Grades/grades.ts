import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'
import { authenticateUser } from '../../AuthUser/AuthenticateUser'
import { redis } from "../../RedisConnection"
import { generateSingleReviewCacheKey } from "../../RedisConnection/GeneratedCache"

const prisma = new PrismaClient();
const gradeReq = express.Router();

gradeReq.post('/', authenticateUser, async (req: Request|any, res: Response): Promise<any> => {
    try {
        const {reviewId, rating} = await req.body;
        const singleReviewCacheKey = generateSingleReviewCacheKey(reviewId); 
        const userId = typeof req.user !== 'undefined' ? req.user : undefined;

        await redis.del(singleReviewCacheKey);
           
        if (userId === undefined) {
            return res.status(403).json("please_login_first")
        };

        const existingRating = await prisma.rating.findFirst({
            where: { userId, reviewId },
        });

        if (existingRating) {
            await prisma.rating.update({
                where: {
                    id: existingRating.id,
                },
                data: {
                    ratingNum: rating,
                },
            });
        } else {
            await prisma.rating.create({
                data: {
                    ratingNum: rating,
                    reviewId,
                    userId,
                },
            });
        }

        const ratings = await prisma.rating.findMany({
            where: {
                reviewId: reviewId,
            },
        });

        const totalRating = ratings.reduce((acc, rating) => acc + rating.ratingNum, 0);
        const averageRating = totalRating / ratings.length;

        await prisma.review.update({
            where: {
                id: reviewId,
            },
            data: {
                grade: averageRating,
            },
        });

        res.status(201).json({message: 'Rating updated successfully'});
    } catch (error) {
        res.status(500).json(error);
    }
});

export { gradeReq }