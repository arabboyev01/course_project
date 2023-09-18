
import express, { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import { upload } from "../../utils/diskStorage"
import { authenticateUser } from "../../AuthUser/AuthenticateUser"
import { uploadImageToS3 } from '../../CloudService/connect';

const prisma = new PrismaClient();
const udateReveiwImage = express.Router();

udateReveiwImage.put('/', authenticateUser, upload.single('image'), async (req: Request | any, res: Response): Promise<any> => {
    try {

        const { reviewId } = req.body
        
        const singleReview = await prisma.review.findUnique({where: {id: parseInt(reviewId) }})
        if (!singleReview) {
            return res.status(404).json({ error: 'Review not found' });
        }

        if (req.user === singleReview?.userId || req.admin) {
            const fileBuffer = req.file.buffer;
            const originalFileName = req.file.originalname
            
            const imageUrl: string = await uploadImageToS3(fileBuffer, originalFileName);
            
            const updatedReview = await prisma.review.update({
                where: { id: parseInt(reviewId) },
                data: { imageUrl }
            });
            
            return res.json({ message: 'Review imageUrl updated successfully', updatedReview });

        } else {
            return res.status(501).json("Unathorized user")
        }

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

export { udateReveiwImage }