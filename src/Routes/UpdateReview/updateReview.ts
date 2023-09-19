import express, { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import { authenticateUser } from '../../AuthUser/AuthenticateUser'
import { tagsQuery } from '../../utils/tagsQuery'

const prisma = new PrismaClient();
const updateReview = express.Router();

updateReview.put('/', authenticateUser, async (req: Request | any, res: Response): Promise<any> => {
    const { name, reviewText, groupName, tags, reviewId } = req.body;
    try {
        const singleReview = await prisma.review.findUnique({ where: { id: reviewId }})
    
        if (req.user === singleReview?.userId || req.admin) {
            const tagIds: any = await tagsQuery(tags)
            const updatedReview = await prisma.review.update({
                where: { id: reviewId },
                data: {
                    name,
                    groupName,
                    tags: {
                        connect: tagIds.map((tagId: number) => ({ id: tagId })),
                    },
                    reviewText,
                },
            });

            res.status(200).json(updatedReview);

        } else {
            res.json("Unauthorized user")
        }
    } catch (err) {
        res.json(err)
    }
})

export { updateReview }