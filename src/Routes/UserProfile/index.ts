import express, { Request, Response } from 'express'
import { PrismaClient } from '.prisma/client'
import { userProfileQuery } from '../../utils/userQuery'

const userProfile = express.Router()
const prisma = new PrismaClient()

userProfile.get('/', async (req: Request, res: Response) => {
    const username: string = req.query.username as string

    try {
        const user = await prisma.user.findUnique({
            where: { username },
            select: { ...userProfileQuery }
        })
        if (!user) return res.status(404).json('user not found')

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }

})

export { userProfile }