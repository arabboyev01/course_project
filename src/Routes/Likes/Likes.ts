import express, { Response } from 'express';
import { PrismaClient } from '@prisma/client'
import { authenticateUser } from "../../AuthUser/AuthenticateUser"

const prisma = new PrismaClient();
const likeReq = express.Router();

likeReq.post('/', authenticateUser, async (req: any, res: Response): Promise<any> => {
    try {
        const { reviewId } = req.body;
        const userId = typeof req ?.user !== 'undefined' ? req ?.user : undefined;

        if(userId === undefined) {
            return res.status(403).json("please_login_first")
        }

        const existingLike = await prisma.like.findFirst({
            where: {
                userId: userId,
                reviewId: reviewId,
            },
        })

        if (existingLike) {
            await prisma.like.delete({
                where: {
                    id: existingLike.id,
                },
            });

            const userLikes = await prisma.like.findMany({
                where: {
                    reviewId: reviewId,
                    userId: userId,
                },
            });

            if (userLikes.length === 0) {
                await prisma.like.update({
                    where: {
                        id: reviewId,
                    },
                    data: {
                        isLiked: false,
                    },
                });
            }
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
        res.status(500).json(error);
    }
});

export { likeReq }