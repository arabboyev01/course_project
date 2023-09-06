import express, { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"
import { HashingPassword } from "../../HashingPassword/Hashing"

const prisma = new PrismaClient();
const updateUser = express.Router();

updateUser.post('/', async (req: Request, res: Response): Promise<any> => {
    const { username, firstName, lastName, email, password } = req.body
    const token: any = req.headers.authorization;
    const secretKey: any = process.env.JWT_SECRET_KEY;

    const userKey: any = jwt.verify(token, secretKey)
    const { userId } = userKey;
    const hashPassword = await HashingPassword(password);
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                username,
                firstName,
                lastName,
                email,
                hashPassword
            },
        });
    
        return res.json(updatedUser);
    } catch (error) {
        res.json(error);
    }
})

export { updateUser }