import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const getBookmarks = express.Router()

getBookmarks.get('/', async (req: Request, res: Response) => {
    const userId: string = req.query.userId as string
    const parsedUserId = parseInt(userId)

    try {
        const bookmarks = await prisma.bookmark.findMany({
            where: { userId: parsedUserId }
        })

        if(!bookmarks.length) return res.json('empty bookmark')

        const reviewIds = bookmarks.map(bookmark => bookmark.reviewId)

        const reviews = await prisma.review.findMany({
            where: {
                id: {
                    in: reviewIds
                }
            },
            include: {
                user: true
            }
        })

        return res.json(reviews)

    } catch (err) {
        return res.json(err)
    }
})

export { getBookmarks }