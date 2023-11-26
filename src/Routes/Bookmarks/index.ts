import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticateUser } from '../../AuthUser/AuthenticateUser'
import { CustomRequest } from '../../types'

const prisma = new PrismaClient()
const bookmarks = express.Router()

bookmarks.post('/', authenticateUser, async (req: Request, res: Response) => {
    const { reviewId } = req.body
    const userId = typeof (req as CustomRequest) ?.user !== 'undefined' ? (req as CustomRequest) ?.user : undefined

    if (userId === undefined) {
        return res.status(403).json('please_login_first')
    }

    try {

        const existingLike = await prisma.bookmark.findFirst({
            where: {
                userId: userId,
                reviewId: reviewId,
            },
        })

        if (existingLike) {
    
            await prisma.bookmark.delete({
                where: { id: existingLike.id },
            })

            return res.json('Bookmark deleted')
        } else {
            await prisma.bookmark.create({
                data: { userId, reviewId },
            })

            res.status(201).json('Bookmark created')
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating/creating like' })
    }
})

export { bookmarks }