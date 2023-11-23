import { PrismaClient } from '@prisma/client'
import express, { Request, Response } from 'express'
import { baseQuery } from '../../utils/baseQuery'
const prisma = new PrismaClient()

const ExploreRoute = express.Router()

ExploreRoute.get('/', async (req: Request, res: Response) => {

    try {
        const reviews = await prisma.review.findMany({ ...baseQuery })
        for (let i = reviews.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [reviews[i], reviews[j]] = [reviews[j], reviews[i]]
        }
        res.json(reviews)
    } catch (err) {
        console.log(err)
    }
})

export { ExploreRoute }