import express, { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const prisma = new PrismaClient();
const signUpRoute = express.Router();

signUpRoute.post('/', async (req: Request, res: Response) => {

    const { username, email, firstName, lastName, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                username,
                email,
                firstName,
                lastName,
                hashPassword: hashedPassword,
            },
        });
        const token = jwt.sign({ userId: user.id }, 'user_token')
        res.json({user, token});
    } catch (error) {
        res.status(500).send({ error: "An error occurred during sign-up." });
    }
});

export { signUpRoute };