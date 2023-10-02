import express, { Response, Request } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticateUser } from '../../../AuthUser/AuthenticateUser'
import { baseQuery } from '../../../utils/baseQuery'
const prisma = new PrismaClient()
const singleUserLike = express.Router()
import { PartialLike, CustomRequest } from '../../../types'


singleUserLike.get('/', authenticateUser, async (req: Request, res: Response) => {
    if ((req as CustomRequest).user) {
        try {
            const likes: PartialLike[] = await prisma.like.findMany({
                where: { userId: (req as CustomRequest).user },
            })

            const reviewIds = likes.map((like: PartialLike) => like.reviewId)

            const reviews = await prisma.review.findMany({
                where: { id: { in: reviewIds } },
                ...baseQuery,
            })
            if(reviews.length){
                res.status(200).json(reviews)
            } else {
                res.json('no data')
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'An error occurred while fetching data' })
        }
    } else {
        res.status(401).json({ error: 'Unauthorized user' })
    }
})

export { singleUserLike }