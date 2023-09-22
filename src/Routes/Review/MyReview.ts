import express, { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import { authenticateUser } from "../../AuthUser/AuthenticateUser"
import { clause } from "../../utils/filterLogic"
import { paginateResults } from "../../utils/pagination"
import { Review } from "../../types"

const prisma = new PrismaClient();
const myReveiw = express.Router();

myReveiw.get('/', authenticateUser, async (req: Request | any, res: Response) => {
    const { selectedTags, filterName, sortName, page, pageSize }: Record<string, any> = req.query;
    const intPageSize = parseInt(pageSize)

    try {
        const whereClause = clause(filterName, JSON.parse(selectedTags));
        let reviews;

        if (req.admin) {
            reviews = await paginateResults<Review>(prisma.review, intPageSize, page, sortName, whereClause);
        } else {
            reviews = await paginateResults<Review>( prisma.review, intPageSize, page, sortName,
                { AND: [
                        { userId: req.user },
                        whereClause
                    ]
                },
            );
        }
        return res.json(reviews);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export { myReveiw }