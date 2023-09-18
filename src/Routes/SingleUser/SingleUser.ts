import express, { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import { authenticateUser } from "../../AuthUser/AuthenticateUser"

const prisma = new PrismaClient();
const singleUser = express.Router();

singleUser.get('/', authenticateUser, async (req: Request| any, res: Response): Promise<any> => {
    const userId = req.user;
    
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