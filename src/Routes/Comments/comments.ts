import express, { Request, Response } from "express";
import { PrismaClient } from '.prisma/client';
import { authenticateUser } from "../../AuthUser/AuthenticateUser";

const commentReq = express.Router();
const prisma = new PrismaClient();

commentReq.post("/", authenticateUser, (req: Request, res: Response) => {
    try{
        const { text, userId, reviewId } = req.body
        const response = prisma.comment.create({
            data: {
                text,
                userId,
                reviewId
            }
        })

        res.json(response)
    }catch(err){
        res.status(501).json(err)
    }
})

export { commentReq };