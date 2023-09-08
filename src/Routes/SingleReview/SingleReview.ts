import express, { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const singleReview = express.Router();

singleReview.get('/', async (req: Request, res: Response): Promise<any> => {
    
    const { id }: any = req.query;
    const myId = (+id)

    try {
        const review = await prisma.review.findUnique({
            where: { id: myId },
             include: {
                    tags: {
                        select: {
                            name: true,
                            id: true,
                        },
                    },
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                            imageUrl: true,
                            username: true,
                            id: true,
                        },
                    },
                },
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