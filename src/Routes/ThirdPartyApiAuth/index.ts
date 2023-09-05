import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
import { HashingPassword } from "../../HashingPassword/Hashing"

const prisma = new PrismaClient();

const GetAuthThirdPartyApi = express.Router();

GetAuthThirdPartyApi.post("/", async (req: Request, res: Response) => {
    const { firstName, lastName, username, email, password , imageUrl} = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { username } });

        if (existingUser) {

            const passwordMatch = await bcrypt.compare(password, existingUser.hashPassword);

            if (!passwordMatch) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            const token = jwt.sign({ userId: existingUser.id }, "course_project");

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
            });

            if (newUser.id === 1) {
                await prisma.user.update({
                    where: { id: 1 },//@ts-ignore
                    data: { userType: 'ADMIN' }
                });
            }


            const token = jwt.sign({ userId: newUser.id }, "course_project");

            return res.json({ newUser, token });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

export { GetAuthThirdPartyApi }