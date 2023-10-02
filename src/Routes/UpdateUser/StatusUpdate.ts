import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticateUser } from '../../AuthUser/AuthenticateUser'
import { CustomRequest } from '../../types'

const prisma = new PrismaClient()
const updateUserStatus = express.Router()

updateUserStatus.post('/', authenticateUser, async (req: Request, res: Response) => {
    const { userId, updatedStatus } = req.body

    if ((req as CustomRequest).admin) {
        try {
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    status: updatedStatus
                },
            })

            return res.json(updatedUser)
        } catch (error) {
            res.json(error)
        }
    } else {
        res.status(401).json('Unauthorized')
    }
})

export { updateUserStatus }