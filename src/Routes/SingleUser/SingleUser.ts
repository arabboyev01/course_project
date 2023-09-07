import express, { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"

const prisma = new PrismaClient();
const singleUser = express.Router();

singleUser.get('/', async (req: Request, res: Response): Promise<any> => {
    const token: any = req.headers.authorization;
    const secretKey: any = process.env.JWT_SECRET_KEY;

    const userKey: any = jwt.verify(token, secretKey)
    const { userId } = userKey;
    
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } })

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export { singleUser }