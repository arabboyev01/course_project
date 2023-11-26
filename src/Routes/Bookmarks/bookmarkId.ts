import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const boomarkId = express.Router()

boomarkId.get('/', async (req: Request, res: Response) => {
    const userId: string = req.query.userId as string

    try {
        const bookmarks = await prisma.bookmark.findMany({
            where: { userId: parseInt(userId) },
            select: { reviewId: true },
        })

        const bookmarkReviewId = bookmarks.map((bookmark) => bookmark.reviewId)
        return res.json(bookmarkReviewId)
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating/creating like' })
    }
})

export { boomarkId }