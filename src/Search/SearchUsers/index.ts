import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const searchUsers = express.Router()

searchUsers.get('/', async (req: Request, res: Response) => {
    const username: string | undefined = req.query.username as string | undefined

    try {
        const users = await prisma.user.findMany()

        if (!users || username === undefined) {
            return res.status(404).json({ message: 'Something went wrong or provide a username' })
        }
        const matchingUsers = users.filter(user => user.username.toLowerCase().includes(username.toLowerCase()))
        return res.json(matchingUsers)
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
})

export { searchUsers }