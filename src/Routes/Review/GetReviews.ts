import express, { Request, Response } from 'express'
import { clause } from '../../utils/filterLogic'
import { ParsedTags } from '../../types'
import { paginateResults } from '../../utils/pagination'
import { GetQueryValues } from '../../utils/QueryParams'

const GetReviews = express.Router()

GetReviews.get('/', async (req: Request, res: Response) => {

    const query = GetQueryValues(req)

    const parsedTags: ParsedTags = JSON.parse(query.selectedTags)
    const intPageSize = parseInt(query.pageSize)

    try {
        const whereClause = clause(query.filterName, parsedTags)

        const paginationResult = await paginateResults(intPageSize, query.page, query.sortName, whereClause)

        if (paginationResult.error) {
            res.status(404).json({ error: paginationResult.error })
        } else {
            const { results, totalPages, currentPage } = paginationResult
            res.json({ reviews: results, totalPages, currentPage })
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching reviews.' })
    }
})

export { GetReviews }