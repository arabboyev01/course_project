import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const CheckUser = express.Router()

CheckUser.get('/', async (req: Request, res: Response) => {
    const username: string = req.query.username as string
    try {
        const response = await prisma.user.findUnique({
            where: { username }
        })

        if (!response) return res.json(false)

        return res.json(true)
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching reviews.' })
    }
})

export { CheckUser }