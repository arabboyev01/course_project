import express, { Request, Response } from 'express';
import { uploadImageToS3 } from '../../CloudService/connect';
import { PrismaClient } from '.prisma/client';
import multer from 'multer';
import { authenticateUser } from '../../AuthUser/AuthenticateUser'

const ReviewRoutes = express.Router();
const prisma = new PrismaClient();
const upload = multer({dest: 'uploads/'});

ReviewRoutes.post('/', authenticateUser, upload.single('image'), async (req: Request | any, res: Response) => {

    // try {

    const {name, groupName, tags, reviewText, grade} = req.body;
    if (!req.file) {
        return res.status(400).json({error: 'No image uploaded'});
    }

    console.log(req.file);

    if (!req.user) {
        return res.status(403).json({error: 'Permission denied'});
    }
    const imageUrl: string = await uploadImageToS3(req.file.buffer, req.file.originalname);
    const parsedGrade: number = parseInt(grade);

    const review = await prisma.review.create({
        data: {
            name,
            groupName,
            reviewText,
            imageUrl,
            grade: parsedGrade,
            user: {connect: {id: req.user}},
            tags: {connect: tags.map((tagId: any) => ({id: tagId.id, name: tagId.name}))}
        }
    });
    return res.json(review);
    // } catch (error) {
    //     return res.status(500).json(error);
    // }
})

export { ReviewRoutes };