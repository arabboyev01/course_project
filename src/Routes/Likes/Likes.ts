import express, { Response } from 'express';
import { PrismaClient } from '@prisma/client'
import { authenticateUser } from "../../AuthUser/AuthenticateUser"

const prisma = new PrismaClient();
const likeReq = express.Router();

likeReq.post('/', authenticateUser, async (req: any, res: Response) => {
    const { reviewId } = req.body;
    const userId = typeof req.user !== 'undefined' ? req.user : undefined;
    
    try {
        const existingLike = await prisma.like.findFirst({
            where: {
                userId,
                reviewId,
            },
        });

        if (existingLike) {
            await prisma.like.delete({
                where: {
                    id: existingLike.id,
                },
            });
            return res.status(200).json({ message: 'Like removed.' });
        }

        const newLike = await prisma.like.create({
            data: {
                userId,
                reviewId,
            },
        });
        console.log(newLike);

        res.status(201).json(newLike);
    } catch (error) {
        res.status(500).json(error);
    }
});

export { likeReq }
