import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
const sumOfLike = express.Router();

sumOfLike.get('/', async (req: Request, res: Response): Promise<any> => {
    try {

        const reviews = await prisma.review.findMany();

        const reviewsWithLikeCounts = [];

        for (const review of reviews) {
            const likeCount = await prisma.like.count({
                where: { reviewId: review.id },
            });

            const reviewWithLikeCount = {
                likeCount,
                reviewId: review.id
            };

            reviewsWithLikeCounts.push(reviewWithLikeCount);
        }
        const sortedReviews = reviewsWithLikeCounts.sort((a, b) => a.reviewId - b.reviewId);

        return res.json(reviewsWithLikeCounts);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating/creating like' });
    }


});

export { sumOfLike }