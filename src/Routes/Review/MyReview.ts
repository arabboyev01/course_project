import express, { Request, Response } from 'express'
import { authenticateUser } from '../../AuthUser/AuthenticateUser'
import { clause } from '../../utils/filterLogic'
import { paginateResults } from '../../utils/pagination'
import { CustomRequest } from '../../types'
import { GetQueryValues } from '../../utils/QueryParams'

const myReveiw = express.Router()

myReveiw.get('/', authenticateUser, async (req: Request, res: Response) => {
    const query = GetQueryValues(req)
    const intPageSize = parseInt(query.pageSize)

    try {
        const whereClause = clause(query.filterName, JSON.parse(query.selectedTags))
        let reviews

        if ((req as CustomRequest).admin) {
            reviews = await paginateResults(intPageSize, query.page, query.sortName, whereClause)
        } else {
            reviews = await paginateResults(intPageSize, query.page, query.sortName,
                {
                    AND: [
                        { userId: (req as CustomRequest).user },
                        whereClause
                    ]
                },
            )
        }
        return res.json(reviews)
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
})

export { myReveiw }