import express, { Request, Response } from 'express'
import { PrismaClient } from '.prisma/client'
// import { Review } from '../../types'

const highRate = express.Router()
const prisma = new PrismaClient()

highRate.get('/', async (req: Request, res: Response) => {
    try {
        const topFiveReviews = await prisma.review.findMany({
            orderBy: {
                grade: 'desc',
            },
            take: 4,
        })

        res.status(200).json(topFiveReviews)
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the top reviews.' })
    }
})

export { highRate }