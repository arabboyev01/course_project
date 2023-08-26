import express, { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"
import { HashingPassword } from '../../HashingPassword/Hashing'

const prisma = new PrismaClient();
const signUpRoute = express.Router();

signUpRoute.post('/', async (req: Request, res: Response): Promise<any> => {

    const { username, email, firstName, lastName, password } = req.body;

    const hashedPassword = await HashingPassword(password)

    try {
        const user = await prisma.user.create({
            data: {
                username,
                email,
                firstName,
                lastName,
                hashPassword: hashedPassword
            },
        });
        const token = jwt.sign({ userId: user.id }, 'user_token')
        res.json({user, token});
    } catch (error) {
        res.status(500).send({ error: "An error occurred during sign-up." });
    }
});

export { signUpRoute }