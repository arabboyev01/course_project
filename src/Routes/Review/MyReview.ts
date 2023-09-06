import express, { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"

const prisma = new PrismaClient();
const myReveiw = express.Router();

myReveiw.get('/', async (req: Request, res: Response): Promise<any> => {
    const token: any = req.headers.authorization;
    const secretKey: any = process.env.JWT_SECRET_KEY;

    const userKey: any = jwt.verify(token, secretKey)
    const { userId } = userKey;

    try {
    //    const reviews = await prisma.review.findMany({
    //        where: { userId },
    //    });
       
    //    return res.json(reviews);
    const reviews = await prisma.review.findMany({
        where: { userId },
        include: {
            // Include the associated User data
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    username: true,
                    imageUrl: true,

                    // Add any other fields you need from the User model
                },
            },
            // Include the associated Tags data
            tags: {
                select: {
                    name: true,
                    id: true,
                    // Add any other fields you need from the Tag model
                },
            },
        },
    });
    
    return res.json(reviews);

    } catch (error) {
       return res.status(500).json({ message: 'Internal server error' });
    }
})

export { myReveiw }