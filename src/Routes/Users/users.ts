import express, { Request, Response } from "express";
import { PrismaClient } from '.prisma/client';

const Users = express.Router();
const prisma = new PrismaClient();

Users.get('/', async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching users.' });
    }
})

export { Users };
