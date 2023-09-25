import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
const usersLikedReviewId = express.Router();

usersLikedReviewId.get('/', async (req: Request, res: Response): Promise<any> => {
    const { userId }: any = req.query;

    try {
        const likedReviews = await prisma.like.findMany({
            where: { userId: parseInt(userId) },
            select: { reviewId: true },
        });

        const likedReviewIds = likedReviews.map((like) => like.reviewId);

        return res.json(likedReviewIds);

    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating/creating like' });
    }


});

export { usersLikedReviewId }