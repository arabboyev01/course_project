import express, { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const loginRoute = express.Router();
const prisma = new PrismaClient();

loginRoute.get('/', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { username } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const passwordMatches = await bcrypt.compare(password, user.hashPassword);

        if (!passwordMatches) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user.id }, 'course_project');

        res.json({ user, token });
    } catch (error) {
        res.status(500).send({ error: "An error occurred during login." });
    }
});

export { loginRoute };