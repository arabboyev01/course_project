import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'
import { SeachQueryParams } from "../../types"

const prisma = new PrismaClient();
const SearchReq = express.Router();

SearchReq.get("/", async (req: Request, res: Response) => {
  try {
      const { name, groupName }: SeachQueryParams = req.query
  
      const query = {
          where: {
              name: name ? { contains: name.toLowerCase()} : undefined,
              groupName: groupName ? { contains: groupName.toLowerCase() } : undefined,
          }
      };
  
      const reviews = await prisma.review.findMany(query);

      res.json(reviews);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching reviews.' });
  }
})

export { SearchReq }