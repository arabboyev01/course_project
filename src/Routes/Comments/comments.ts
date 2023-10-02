import express, { Request, Response } from 'express'
import { PrismaClient } from '.prisma/client'
import { authenticateUser } from '../../AuthUser/AuthenticateUser'
import { CustomRequest } from '../../types'

const commentReq = express.Router()
const prisma = new PrismaClient()

commentReq.post('/', authenticateUser, async (req: Request, res: Response) => {
    try {
        const { text, reviewId } = req.body
        if(!(req as CustomRequest).user) return res.json('Unauthorized')

        const userId: number = (req as CustomRequest).user
        const response = await prisma.comment.create({
            data: {
                text,
                userId,
                reviewId
            }
        })
        res.json(response)
    } catch (err) {
        res.status(501).json(err)
    }
})

export { commentReq }