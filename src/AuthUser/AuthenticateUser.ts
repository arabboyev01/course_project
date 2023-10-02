import { Request, Response, NextFunction } from 'express'
import jwt, { Secret } from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { DecodedToken } from '../types'
import { JwtPayload } from 'jsonwebtoken'
import { CustomRequest } from '../types'

const prisma = new PrismaClient()

const authenticateUser = async function(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization
    try {
        const decodedToken: DecodedToken = await verifyToken(token)
        if (decodedToken) (req as CustomRequest).user = (decodedToken as JwtPayload).userId

        const singleUser = await prisma.user.findUnique({ where: { id: (decodedToken as JwtPayload).userId } })

        if (singleUser) {
            (req as CustomRequest).admin= singleUser?.userType === 'ADMIN'
        }

        next()
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
}

async function verifyToken(token: string | undefined) {

    const secretKey: Secret | undefined = process.env.JWT_SECRET_KEY
    try {
        if (token && secretKey) return jwt.verify(token, secretKey)
        else throw new Error()

    } catch (error) {
        return ('Token verification failed:')
    }
}

export { authenticateUser }