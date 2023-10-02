import { baseQuery } from '../utils/baseQuery'
import { PrismaClient, Prisma } from '@prisma/client'

const prisma: PrismaClient = new PrismaClient()

async function paginateResults(          
    pageSize: number,
    page: string,
    sortName: string, 
    whereClause: Prisma.ReviewWhereInput|undefined
) {
    const pageNumber = parseInt(page, 10) || 1

    try {
        const totalResults = await prisma.review.count()
        const totalPages = Math.ceil(totalResults / pageSize)

        if (pageNumber < 1 || pageNumber > totalPages) {
            return {
                error: 'Page not found.',
            }
        }

        const skip = (pageNumber - 1) * pageSize

        const results = await prisma.review.findMany({
            where: whereClause,
            orderBy: [
                sortName === 'asc' ? { name: 'asc' } : sortName === 'desc' ? { name: 'desc' } : {},
            ],
            skip,
            take: pageSize,
            ...baseQuery
        })

        return {
            results,
            totalPages,
            currentPage: totalResults,
        }
    } catch (error) {
        return {
            error: 'An error occurred while paginating results.',
        }
    }
}

export { paginateResults }
