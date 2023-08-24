import express, { Request, Response } from 'express';
import { uploadImageToS3, s3 } from '../../CloudService/connect';
import { PrismaClient } from '.prisma/client';
import { PutObjectCommand } from "@aws-sdk/client-s3"

const ReviewRoutes = express.Router();
const prisma = new PrismaClient();

ReviewRoutes.post("/", async (req: Request, res: Response) => {

    const imageUrl = req?.files?.data;
    const { name, groupName, tags, reviewText, grade, userId } = req.body;

    const putObject = imageUrl && uploadImageToS3(imageUrl);
    putObject && s3.send(new PutObjectCommand(putObject));
    const imageURL = s3 && `https://${putObject.Bucket}.s3.amazonaws.com/${putObject.Key}`

    try {
        const review = await prisma.review.create({
            data: {
                name,
                groupName,
                reviewText,
                imageUrl: imageURL,
                grade,
                user: { connect: { id: userId } },
                tags: { connect: tags.map((tagId: number) => ({ id: tagId }))}
            }
        });

        res.json(review);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the review.' });
    }

})

export { ReviewRoutes };