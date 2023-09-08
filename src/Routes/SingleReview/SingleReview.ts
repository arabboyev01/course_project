import express, { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import { baseQuery } from '../../utils/baseQuery';

const prisma = new PrismaClient();
const singleReview = express.Router();

singleReview.get('/', async (req: Request, res: Response): Promise<any> => {

    const { id }: any = req.query;
    const myId = parseInt(id)

    try {
        const review = await prisma.review.findUnique({
            where: { id: myId },
            ...baseQuery
        });

        if (!review) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json(review);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export { singleReview };