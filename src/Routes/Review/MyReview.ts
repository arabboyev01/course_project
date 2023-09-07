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
        const reviews = await prisma.review.findMany({
            where: { userId },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        username: true,
                        imageUrl: true,
                    },
                },
                tags: {
                    select: {
                        name: true,
                        id: true,
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