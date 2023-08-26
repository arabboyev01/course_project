import express, { Request, Response } from 'express';
import { uploadImageToS3 } from '../../CloudService/connect';
import { PrismaClient } from '.prisma/client';
import multer from 'multer';
import { authenticateUser } from '../../AuthUser/AuthenticateUser'

const ReviewRoutes = express.Router();
const prisma = new PrismaClient();
const upload = multer({dest: 'uploads/'});

ReviewRoutes.post('/', authenticateUser, upload.single('image'), async (req: Request, res: Response) => {

    try {

        const {name, groupName, tags, reviewText, grade, userId} = req.body;
         if (!name || !groupName || !reviewText || !grade || !userId || !req.file) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // @ts-ignore
        const authenticatedUser = await req.user;

         if (!authenticatedUser.isAdmin) {
            return res.status(403).json({ error: 'Permission denied' });
        }

        const imageUrl: string = await uploadImageToS3(req.file.buffer, req.file.originalname);
        const parsedGrade: number = parseInt(grade);
        const parsedUserId: number = parseInt(userId)

        const review = await prisma.review.create({
            data: {
                name,
                groupName,
                reviewText,
                imageUrl,
                grade: parsedGrade,
                user: {connect: {id: parsedUserId}},
                // tags: { connect: tags.map((tagId: any) => ({ id: tagId.id })) }
            }
        });
        return res.json(review);
    } catch (error) {
        return res.status(500).json(error);
    }

});

export { ReviewRoutes };