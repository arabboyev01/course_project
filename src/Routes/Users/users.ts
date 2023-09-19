import express, { Request, Response } from "express";
import { PrismaClient } from '.prisma/client';
import { authenticateUser } from "../../AuthUser/AuthenticateUser"
const users = express.Router();
const prisma = new PrismaClient();

users.get('/', authenticateUser, async (req: Request | any, res: Response) => {

    if (req.admin) {
        try {
            const users = await prisma.user.findMany();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.json("Unauthorized user")
    }
})

export { users };