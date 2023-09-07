import express, { Request, Response } from "express";
import { PrismaClient } from '.prisma/client';
const GetReviews = express.Router();
const prisma = new PrismaClient();

GetReviews.get('/', async (req: Request, res: Response) => {
    const { selectedTags }: string | any = req.query
    const parsed = JSON.parse(selectedTags);
    if(!selectedTags){
        res.json('Please provide a query');
        return;
    }

    try {
        let reviews;

        if (parsed?.length > 0 && Array.isArray(parsed)) {
            reviews = await prisma.review.findMany({
                where: {
                    tags: {
                        some: {
                            name: {
                                in: parsed
                            }
                        },
                    },
                },
                include: {
                    tags: {
                        select: {
                            name: true,
                            id: true,
                        },
                    },
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                            imageUrl: true,
                            username: true,
                            id: true,
                        },
                    },
                },
            });
        } else {
            reviews = await prisma.review.findMany({
                include: {
                    tags: {
                        select: {
                            name: true,
                            id: true,
                        },
                    },
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                            imageUrl: true,
                            username: true,
                            id: true,
                        },
                    },
                },
            });
        }

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching reviews.' });
    }
});

export { GetReviews };