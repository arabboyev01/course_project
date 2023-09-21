import express, { Request, Response } from "express";
import { PrismaClient } from '.prisma/client';
import { baseQuery } from "../../utils/baseQuery"
import { clause } from "../../utils/filterLogic"

const GetReviews = express.Router();
const prisma = new PrismaClient();

GetReviews.get("/", async (req: Request, res: Response) => {

    const { selectedTags, filterName, sortName }: string | any = req.query;
    const parsedTags = JSON.parse(selectedTags);

    try {
        const whereClause = clause(filterName, parsedTags)

        const reviews = await prisma.review.findMany({
            where: whereClause,
            orderBy: [
                sortName === 'asc' ? { name: 'asc' } : sortName === 'desc' ? { name: 'desc' } : {},
            ],
            ...baseQuery
        });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching reviews.' });
    }

})

export { GetReviews };