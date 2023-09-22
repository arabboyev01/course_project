import express, { Request, Response } from "express";
import { PrismaClient } from '.prisma/client';
import { clause } from "../../utils/filterLogic"
import { RequestQuery, ParsedTags, Review, PaginationResult } from "../../types"
import { paginateResults } from "../../utils/pagination"

const GetReviews = express.Router();
const prisma: PrismaClient = new PrismaClient();

GetReviews.get("/", async (req: Request, res: Response) => {

    const { selectedTags, filterName, sortName, page, pageSize }: RequestQuery|any = req.query;

    const parsedTags: ParsedTags = JSON.parse(selectedTags);
    const intPageSize = parseInt(pageSize)

    try {
        const whereClause = clause(filterName, parsedTags)
        
        const paginationResult: PaginationResult<Review> = await paginateResults(prisma.review, intPageSize, page, sortName, whereClause);
        
        if (paginationResult.error) {
            res.status(404).json({ error: paginationResult.error });
        } else {
            const { results, totalPages, currentPage } = paginationResult;
            res.json({ reviews: results, totalPages, currentPage });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching reviews.' });
    }

})

export { GetReviews };