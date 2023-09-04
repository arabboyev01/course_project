import express, { Request, Response } from "express";
import { PrismaClient } from '.prisma/client';
const GetTags = express.Router();
const prisma = new PrismaClient();

GetTags.get('/', async (req: Request, res: Response) => {
    try {
        const reviews = await prisma.tag.findMany();
        res.json(reviews);

    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching reviews.' });
    }
});

export { GetTags };