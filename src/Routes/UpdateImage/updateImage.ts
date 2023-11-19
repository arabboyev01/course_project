
import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { upload } from '../../utils/diskStorage'
import { authenticateUser } from '../../AuthUser/AuthenticateUser'
import { uploadImageToGoogleCloud } from '../../CloudService/CloudFlier'
import { CustomRequest } from '../../types'

const prisma = new PrismaClient()
const updateUserImage = express.Router()

updateUserImage.put('/', authenticateUser, upload.single('image'), async (req: Request, res: Response) => {
    try {

        const id = (req as CustomRequest).user

        if(!req.file) return res.json('Please upload an image')

        const imageUrl: string = await uploadImageToGoogleCloud(req.file)

        const existingUser = await prisma.user.findUnique({
            where: { id }
        })

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' })
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { imageUrl }
        })

        res.json({ message: 'User imageUrl updated successfully', updatedUser })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

export { updateUserImage }