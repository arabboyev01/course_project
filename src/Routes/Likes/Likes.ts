import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
const likeReq = express.Router();

likeReq.post('/', async (req: Request, res: Response) => {
     try {
    const { userId, reviewId } = req.body;

    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        reviewId,
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return res.status(200).json({ message: 'Like removed.' });
    }

    const newLike = await prisma.like.create({
      data: {
        userId,
        reviewId,
      },
    });

    res.status(201).json(newLike);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while handling the like.' });
  }
});

export { likeReq }
