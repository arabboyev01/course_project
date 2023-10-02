import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticateUser } from '../../AuthUser/AuthenticateUser'
import { tagsQuery } from '../../utils/tagsQuery'
import { CustomRequest } from '../../types'


const prisma = new PrismaClient()
const updateReview = express.Router()

updateReview.put('/', authenticateUser, async (req: Request, res: Response) => {
    const { name, reviewText, groupName, tags, reviewId } = req.body
    try {
        const singleReview = await prisma.review.findUnique({ where: { id: reviewId } })

        if ((req as CustomRequest).user === singleReview ?.userId || (req as CustomRequest).admin) {
            const tagIds = await tagsQuery(tags)
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
            })

            res.status(200).json(updatedReview)

        } else {
            res.json('Unauthorized user')
        }
    } catch (err) {
        res.json(err)
    }
})

export { updateReview }