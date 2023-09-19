import express, { Response } from 'express';
import { PrismaClient } from '@prisma/client'
import { authenticateUser } from "../../AuthUser/AuthenticateUser"

const prisma = new PrismaClient();
const removeReview = express.Router();

removeReview.delete('/', authenticateUser, async (req: any, res: Response): Promise<any> => {

    if(req.user || req.admin){
        try {
            const { id } = req.body
            const deletedReview = await prisma.review.delete({
                where: { id }
            });
        
            return res.json(`Review with ID ${deletedReview.id} has been deleted.`);
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.json("Unauthorized user")
    }
});

export { removeReview }