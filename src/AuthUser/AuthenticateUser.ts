import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const authenticateUser = async function(req: Request | any, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    try {
        const decodedToken: any = await verifyToken(token)
        req.user = decodedToken.userId;
        const singleUser = await prisma.user.findUnique({ where: { id: decodedToken.userId } })

        if(singleUser){
            req.admin = singleUser?.userType === "ADMIN"
        }

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}

async function verifyToken(token: string | any) {

    const secretKey: Secret | any = process.env.JWT_SECRET_KEY;

    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        return ('Token verification failed:');
    }
}

export { authenticateUser }