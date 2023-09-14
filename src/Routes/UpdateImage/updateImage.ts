
import express, { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import { upload } from "../../utils/diskStorage"
import { authenticateUser } from "../../AuthUser/AuthenticateUser"
import { uploadImageToS3 } from '../../CloudService/connect';

const prisma = new PrismaClient();
const updateUserImage = express.Router();

updateUserImage.put('/', authenticateUser, upload.single('image'), async (req: Request | any, res: Response):Promise<any> => {
    try {

        const id = req.user
        const fileBuffer = req.file.buffer;
        const originalFileName = req.file.originalname

        const imageUrl: string = await uploadImageToS3(fileBuffer, originalFileName);

        const existingUser = await prisma.user.findUnique({
            where: { id }
        });

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { imageUrl }
        });

        res.json({ message: 'User imageUrl updated successfully', updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

export { updateUserImage }