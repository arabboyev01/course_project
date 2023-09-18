import express, { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import { authenticateUser } from "../../AuthUser/AuthenticateUser"
import { query } from "./query"

const prisma = new PrismaClient();
const myReveiw = express.Router();

myReveiw.get('/', authenticateUser, async (req: Request|any, res: Response) => {

    const userId = req.user;

    try {
        const isAdmin = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (isAdmin?.userType === "ADMIN") {
            const allReviews = await prisma.review.findMany({
                ...query
            });
            return res.json(allReviews);
        } else{
            const reviews = await prisma.review.findMany({
                where: { userId },
                ...query
            });
            
            return res.json(reviews);
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


export { myReveiw }