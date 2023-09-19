import express, { Request, Response } from 'express';
import { uploadImageToS3 } from '../../CloudService/connect';
import { PrismaClient } from '.prisma/client';
import { authenticateUser } from '../../AuthUser/AuthenticateUser'
import { upload } from "../../utils/diskStorage"
import { tagsQuery } from '../../utils/tagsQuery'

const ReviewRoutes = express.Router();
const prisma = new PrismaClient();

ReviewRoutes.post('/', authenticateUser, upload.single('image'), async (req: Request | any, res: Response) => {

    try {

        const { name, groupName, tags, reviewText, userId } = req.body;
        const tagsArray = JSON.parse(tags);
        const parsedId = parseInt(userId)
        const tagIds: any = await tagsQuery(tagsArray)
        const user = await prisma.user.findUnique({where: {id: req.user}})

        if(user){
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
                    userId: req.admin ? parsedId: req.user,
                },
            });
            
            res.json(review);
        } else {
            res.json("Unauthorized user")
        }

    } catch (error) {
        return res.status(500).json(error);
    }
})

export { ReviewRoutes };