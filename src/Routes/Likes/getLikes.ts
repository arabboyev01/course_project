import express, { Response, Request } from 'express';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
const getLike = express.Router();

getLike.get("/", async (req: Request, res: Response) => {
   try {
       const likes = await prisma.like.findMany();
       const users = await prisma.user.findMany(); 
   
       res.status(200).json(likes);
   } catch (error) {
       res.status(500).json({ error: 'An error occurred while fetching data' });
   }
})

export { getLike }