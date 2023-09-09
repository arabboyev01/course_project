import express, { Request, Response } from "express";
import { PrismaClient } from '.prisma/client';
const GetReviews = express.Router();
const prisma = new PrismaClient();
import { baseQuery } from "../../utils/baseQuery"

GetReviews.get('/', async (req: Request, res: Response) => {
    const { selectedTags, groupName }: string | any = req.query
    const parsedTags = JSON.parse(selectedTags);

    try {
        let reviews;
        if (parsedTags) {

            if (parsedTags.length > 0) {
                reviews = await prisma.review.findMany({
                    where: {
                        tags: {
                            some: {
                                name: {
                                    in: parsedTags,
                                },
                            },
                        },
                    },
                    ...baseQuery,
                });
            } else {
                reviews = await prisma.review.findMany(baseQuery);
            }
        } else if (groupName !== "null") {
            reviews = await prisma.review.findMany({
                where: { groupName },
                ...baseQuery,
            });
        } else {
            reviews = await prisma.review.findMany(baseQuery);
        }

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching reviews.' });
    }
});

export { GetReviews };