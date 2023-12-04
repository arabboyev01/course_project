import express, { Request, Response } from 'express'
import { SeachQueryParams } from '../../types'
import { retrieveDataFromDatabase } from './retriveData'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const SearchReq = express.Router()

SearchReq.get('/', async (req: Request, res: Response) => {

    try {
        const { name, username }: SeachQueryParams = req.query
       
        if (name) {

            const allReviews = await retrieveDataFromDatabase()
            if (allReviews && allReviews.length > 0) {
                const lowercaseAllReviewNames = allReviews.map(({ name }: { name: string }) => name.toLowerCase())
                const filteredReviews = allReviews.filter(
                    (_, index: number) => !name || lowercaseAllReviewNames[index].includes(name.toLowerCase()))

                res.json(filteredReviews)
            }
        } else if (username) {
            const allUsers = await prisma.user.findMany()
            if (allUsers && allUsers.length > 0) {
                const lowercaseAllUsernames = allUsers.map(({ username }: { username: string }) => username.toLowerCase())

                const filteredUsers = allUsers.filter((_, index: number) => !username || lowercaseAllUsernames[index].includes(username.toLowerCase()))

                const changedData = filteredUsers.map(({ id, username, email, imageUrl }) => ({
                    id,
                    name: username,
                    groupName: email,
                    imageUrl
                }))

                return res.json(changedData)
            }
        }

    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching reviews.' })
    }
})

export { SearchReq }