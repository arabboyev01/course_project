import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { HashingPassword } from '../../HashingPassword/Hashing'
import { authenticateUser } from '../../AuthUser/AuthenticateUser'
import { CustomRequest } from '../../types'

const prisma = new PrismaClient()
const updateUser = express.Router()

updateUser.post('/', authenticateUser, async (req: Request, res: Response) => {
    const { username, firstName, lastName, email, password } = req.body

    const hashPassword = await HashingPassword(password)

    try {
        const updatedUser = await prisma.user.update({
            where: { id: (req as CustomRequest).user },
            data: {
                username,
                firstName,
                lastName,
                email,
                hashPassword
            },
        })
    
        return res.json(updatedUser)
    } catch (error) {
        res.json(error)
    }
})

export { updateUser }