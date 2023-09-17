import express, { Response } from 'express';
import { PrismaClient } from '@prisma/client'
import { authenticateUser } from "../../AuthUser/AuthenticateUser"

const prisma = new PrismaClient();
const likeReq = express.Router();

likeReq.post('/', authenticateUser, async (req: any, res: Response): Promise<any> => {
    const { reviewId } = req.body;
    const userId = typeof req ?.user !== 'undefined' ? req ?.user : undefined;
    
    if (userId === undefined) {
        return res.status(403).json("please_login_first");
    }
    
    try {
        const existingLike = await prisma.like.findFirst({
            where: {
                userId: userId,
                reviewId: reviewId,
            },
        });
    
        if (existingLike) {
            const updatedLike = await prisma.like.update({
                where: {
                    id: existingLike.id,
                },
                data: {
                    isLiked: !existingLike.isLiked,
                },
            });
    
            return res.json(`Like with userId ${userId}, reviewId ${reviewId} updated: isLiked=${updatedLike.isLiked}`);
        } else {
            const like = await prisma.like.create({
                data: {
                    userId: userId,
                    reviewId: reviewId,
                    isLiked: true,
                },
            });
    
            res.status(201).json(like);
        }
    } catch (error) {
        console.error('Error updating/creating like:', error);
        res.status(500).json({ error: 'An error occurred while updating/creating like' });
    }
    
});

export { likeReq }