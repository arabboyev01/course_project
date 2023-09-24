import express, { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const loginRoute = express.Router();
const prisma = new PrismaClient();

loginRoute.post('/', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { username } });

        if (!user) {
            throw new Error
        }

        const passwordMatches = await bcrypt.compare(password, user.hashPassword);

        if (!passwordMatches) {
             throw new Error
        }

        if (passwordMatches && user.status === 'block') {
            return res.json('user is blocked')
        }

        const token = jwt.sign({ userId: user.id }, 'course_project');

        res.json({ user, token });
    } catch (error) {
        res.status(500).send({ error: "An error occurred during login." });
    }
});

export { loginRoute };