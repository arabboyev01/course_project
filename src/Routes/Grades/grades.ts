import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
const gradeReq = express.Router();

gradeReq.post('/', async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, reviewId, rating } = await req.body;

        const existingRating = await prisma.rating.findFirst({
            where: {
                userId,
                reviewId,
            },
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

        res.status(201).json({ message: 'Rating updated successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
});


export { gradeReq }