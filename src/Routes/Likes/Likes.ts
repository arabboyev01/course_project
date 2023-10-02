import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticateUser } from '../../AuthUser/AuthenticateUser'
import { CustomRequest } from '../../types'

const prisma = new PrismaClient()
const likeReq = express.Router()

likeReq.post('/', authenticateUser, async (req: Request, res: Response) => {
    const { reviewId } = req.body
    const userId = typeof (req as CustomRequest) ?.user !== 'undefined' ? (req as CustomRequest)?.user : undefined

    if (userId === undefined) {
        return res.status(403).json('please_login_first')
    }

    try {

        const existingLike = await prisma.like.findFirst({
            where: {
                userId: userId,
                reviewId: reviewId,
            },
        })

        if (existingLike) {
            await prisma.review.update({
                where: { id: reviewId },
                data: { isLiked: false },
            })

            await prisma.like.delete({
                where: { id: existingLike.id },
            })

            return res.json(`Like with userId ${userId}, reviewId ${reviewId} was removed`)
        } else {
            const like = await prisma.like.create({
                data: { userId: userId, reviewId: reviewId },
            })

            await prisma.review.update({
                where: { id: reviewId },
                data: { isLiked: true }
            })

            res.status(201).json(like)
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating/creating like' })
    }
})

export { likeReq }