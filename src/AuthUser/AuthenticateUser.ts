import { Request, Response } from 'express';
import jwt, { GetPublicKeyOrSecret, Secret } from 'jsonwebtoken';

const authenticateUser = async function (req: Request, res: Response, next: Function): Promise<any> {

    const token = await req.headers.Authorization;

    try {
        const decodedToken = await verifyToken(token);
        // @ts-ignore
        req.user = decodedToken.user;
        next();
    } catch (error) {
        return res.status(401).json({error: 'Unauthorized'});
    }
}

function verifyToken(token: string | string[] | any): void {
    // @ts-ignore
    const secretKey: Secret | GetPublicKeyOrSecret = process.env.JWT_SECRET_KEY;

    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        throw new Error('Invalid token');
    }
}

export { authenticateUser }