import express, { Request, Response } from "express";
import { PrismaClient } from '.prisma/client';
import { authenticateUser } from "../../AuthUser/AuthenticateUser";

const commentReq = express.Router();
const prisma = new PrismaClient();

commentReq.post("/", authenticateUser, async (req: Request | any, res: Response) => {
    try {
        const { text, reviewId } = req.body
        const userId = typeof req.user !== 'undefined' ? req.user : undefined;
        const response = await prisma.comment.create({
            data: {
                text,
                userId,
                reviewId
            }
        })
        res.json(response)
    } catch (err) {
        res.status(501).json(err)
    }
})

export { commentReq };