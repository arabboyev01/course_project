import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

const authenticateUser = function (req: Request | any, res: Response, next: NextFunction) {

    const token = req.headers.authorization;
    try {
        const decodedToken: any = verifyToken(token)
        req.user = decodedToken.userId;
        req.admin = decodedToken.userType === "ADMIN"

        next();
    } catch (error) {
        return res.status(401).json({error: 'Unauthorized'});
    }
}

function verifyToken(token: string | any) {

    const secretKey: Secret | any = process.env.JWT_SECRET_KEY;

    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        return ('Token verification failed:');
    }
}

export { authenticateUser }