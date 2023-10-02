import express, { Request, Response } from 'express'
import { SeachQueryParams } from '../../types'
import { retrieveDataFromDatabase } from './retriveData'

const SearchReq = express.Router()

SearchReq.get('/', async (req: Request, res: Response) => {
    try {
        const { name, groupName }: SeachQueryParams = req.query
        const Groups = groupName
        
        const allReviews = await retrieveDataFromDatabase()

        const lowercaseAllReviewNames = allReviews.map(({name}: {name: string}) => name.toLowerCase())
        
        const filteredReviews = allReviews.filter(({groupName}: {groupName: string}, index: number) => {
            const lowercaseName = lowercaseAllReviewNames[index]
            return (
                (!name || lowercaseName.includes(name.toLowerCase())) &&
                (!Groups || groupName.toLowerCase().includes(groupName.toLowerCase()))
            )
        })
        
        res.json(filteredReviews)
        
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching reviews.' })
    }
})

export { SearchReq }