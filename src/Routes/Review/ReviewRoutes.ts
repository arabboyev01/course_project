import express, { Request, Response } from 'express'
import { PrismaClient } from '.prisma/client'
import { authenticateUser } from '../../AuthUser/AuthenticateUser'
import { upload } from '../../utils/diskStorage'
import { tagsQuery } from '../../utils/tagsQuery'
import { CustomRequest } from '../../types'
import { uploadImageToGoogleCloud } from '../../CloudService/CloudFlier'

const ReviewRoutes = express.Router()
const prisma: PrismaClient = new PrismaClient()

ReviewRoutes.post('/', authenticateUser, upload.single('image'), async (req: Request, res: Response) => {

    const { name, groupName, tags, reviewText, userId } = req.body

    try {
        const tagsArray = JSON.parse(tags)
        const parsedId = parseInt(userId)
        const tagIds = await tagsQuery(tagsArray)

        const user = await prisma.user.findUnique(
            { where: { id: (req as CustomRequest).user } }
        )

        if (user && req.file) {
            const imageUrl = await uploadImageToGoogleCloud(req.file)
            // if (!parsedId || !(req as CustomRequest).admin || (req as CustomRequest).user === undefined) return res.json('plese provide userId')

            const review = await prisma.review.create({
                data: {
                    name,
                    groupName,
                    tags: {
                        connect: tagIds.map((tagId: number) => ({ id: tagId })),
                    },
                    reviewText,
                    imageUrl,
                    userId: (req as CustomRequest).admin ? parsedId : (req as CustomRequest).user,
                },
            })
            res.json(review)
        }
        else {
            res.json('Unauthorized user')
        }

    } catch (error) {
        return res.status(500).json(error)
    }
})

export { ReviewRoutes }