import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticateUser } from '../../AuthUser/AuthenticateUser'
import { CustomRequest } from '../../types'

const prisma = new PrismaClient()
const removeReview = express.Router()

removeReview.delete('/', authenticateUser, async (req: Request, res: Response) => {

    if((req as CustomRequest).user || (req as CustomRequest).admin){
        try {
            const { id } = req.body
            const deletedReview = await prisma.review.delete({ where: { id } })
        
            return res.json(`Review with ID ${deletedReview.id} has been deleted.`)
        } catch (error) {
            res.status(500).json(error)
        }

    } else {
        res.status(401).json('Unauthorized user')
    }
})

export { removeReview }