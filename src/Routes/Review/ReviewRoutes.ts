import express, { Request, Response } from 'express';
import { uploadImageToS3 } from '../../CloudService/connect';
import { PrismaClient } from '.prisma/client';
import { authenticateUser } from '../../AuthUser/AuthenticateUser'
import { upload } from "../../utils/diskStorage"

const ReviewRoutes = express.Router();
const prisma = new PrismaClient();


ReviewRoutes.post('/', authenticateUser, upload.single('image'), async (req: Request, res: Response) => {

    try {

        if (!req.file) return res.status(400).send('No image was uploaded.');

        const { name, groupName, tags, reviewText, grade, userId } = req.body;
        // const fileBuffer = req.file.buffer;
        // const originalFileName = req.file.originalname


        // const imageUrl: string = await uploadImageToS3(fileBuffer, originalFileName);


        const review = await prisma.review.create({
            data: {
                name,
                groupName,
                reviewText,
                imageUrl: "/smdfkmkmscldsfds",
                grade,
                userId,
                tags: { connect: tags.map((tagId: any) => ({ id: tagId.id, name: tagId.name })) },
            },
        });

        res.json(review);
    } catch (error) {
        return res.status(500).json(error);
    }
})

export { ReviewRoutes };