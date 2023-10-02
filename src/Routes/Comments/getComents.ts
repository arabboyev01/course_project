import express, { Request, Response } from 'express'
import { PrismaClient } from '.prisma/client'

const getcomment = express.Router()
const prisma = new PrismaClient()

getcomment.get('/', async (req: Request, res: Response) => {
    try {
        
        const reviewId: string | undefined = req.query.reviewId as string | undefined

        if(!reviewId) return res.json('Please provide reviewId')

        const reviewID = parseInt(reviewId)
        const response = await prisma.comment.findMany({
            where: { reviewId: reviewID },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        imageUrl: true
                    },
                },
            },
        })
        res.json(response)
    } catch (err) {
        return res.status(500).json(err)
    }
})

export { getcomment }