import express, { Request, Response } from 'express';
import { uploadImageToS3 } from '../../CloudService/connect';
import { PrismaClient } from '.prisma/client';
import { authenticateUser } from '../../AuthUser/AuthenticateUser'
import { upload } from "../../utils/diskStorage"
import { tagsQuery } from '../../utils/tagsQuery'

const ReviewRoutes = express.Router();
const prisma = new PrismaClient();

ReviewRoutes.post('/', authenticateUser, upload.single('image'), async (req: Request | any, res: Response) => {

    const { name, groupName, tags, reviewText, userId } = req.body;
    const tagsArray = JSON.parse(tags);
    const parseUser = parseInt(userId)
    const tagIds: any = await tagsQuery(tagsArray)

    try {
    const fileBuffer = req.file.buffer;
    const originalFileName = req.file.originalname

    const imageUrl: string = await uploadImageToS3(fileBuffer, originalFileName);

    const review = await prisma.review.create({
        data: {
            name,
            groupName,
            tags: {
                connect: tagIds.map((tagId: number) => ({ id: tagId })),
            },
            reviewText,
            imageUrl,
            userId: parseUser,
        },
    });

    res.json(review);
    } catch (error) {
        return res.status(500).json(error);
    }
})

export { ReviewRoutes };