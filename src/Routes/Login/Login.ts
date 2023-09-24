import express, { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const loginRoute = express.Router();
const prisma = new PrismaClient();

loginRoute.post('/', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const singleUser = await prisma.user.findUnique({ where: { username } });

        if (!singleUser) {
            throw new Error
        }

        const passwordMatches = await bcrypt.compare(password, singleUser.hashPassword);

        if (!passwordMatches) {
             throw new Error
        }

        if (passwordMatches && singleUser.status === 'block') {
            return res.json('user is blocked')
        }

        const token = jwt.sign({ userId: singleUser.id }, 'course_project');

        res.json({ singleUser, token });
    } catch (error) {
        res.status(500).send({ error: "An error occurred during login." });
    }
});

export { loginRoute };