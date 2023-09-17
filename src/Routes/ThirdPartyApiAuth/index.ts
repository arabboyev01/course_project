import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { HashingPassword } from "../../HashingPassword/Hashing"

const prisma = new PrismaClient();

const GetAuthThirdPartyApi = express.Router();

GetAuthThirdPartyApi.post("/", async (req: Request, res: Response) => {
    const { firstName, lastName, username, email, password , imageUrl} = req.body;
    const secretKey = process.env.JWT_SECRET_KEY

    try {
        const existingUser = await prisma.user.findUnique({ where: { username } });

        if (existingUser) {

            const token = jwt.sign({ userId: existingUser.id }, secretKey as string);

            return res.json({ existingUser, token });
            
        } else {

            const hashedPassword = await HashingPassword(password);

            const newUser = await prisma.user.create({
                data: {
                    username,
                    email,
                    firstName,
                    lastName,
                    hashPassword: hashedPassword,
                    imageUrl
                },
            })

            if (newUser.id === 1) {
                await prisma.user.update({
                    where: { id: 1 },//@ts-ignore
                    data: { userType: 'ADMIN' }
                });
            }

            const token = jwt.sign({ userId: newUser.id }, secretKey as string);

            return res.json({ newUser, token });
        }

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
});

export { GetAuthThirdPartyApi }