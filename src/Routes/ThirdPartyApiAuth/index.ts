import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
import { HashingPassword } from "../../HashingPassword/Hashing"

const prisma = new PrismaClient();

const GetAuthThirdPartyApi = express.Router();

GetAuthThirdPartyApi.post("/", async (req: Request, res: Response) => {
    const { firstName, lastName, username, email, password } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { username } });

        if (existingUser) {

            const passwordMatch = await bcrypt.compare(password, existingUser.hashPassword);

            if (!passwordMatch) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            const token = jwt.sign({ userId: existingUser.id }, "course_project");

            return res.json({ message: 'You are logged in', token });
        } else {

            const hashedPassword = await HashingPassword(password);

            const newUser = await prisma.user.create({
                data: {
                    firstName,
                    lastName,
                    username,
                    email,
                    hashPassword: hashedPassword,
                },
            });


            const token = jwt.sign({ userId: newUser.id }, "course_project");

            return res.json({ message: 'User created successfully', token });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

export { GetAuthThirdPartyApi }