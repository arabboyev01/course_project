import { PaginationResult } from "../types"
import { baseQuery } from "../utils/baseQuery"

async function paginateResults<T>(
    model: any,
    pageSize: number,
    page: string,
    sortName: string, whereClause: any
): Promise<PaginationResult<T>> {
    const pageNumber = parseInt(page, 10) || 1;

    try {
        const totalResults = await model.count();
        const totalPages = Math.ceil(totalResults / pageSize);

        if (pageNumber < 1 || pageNumber > totalPages) {
            return {
                error: 'Page not found.',
            };
        }

        const skip = (pageNumber - 1) * pageSize;
        const results = await model.findMany({
            where: whereClause,
            orderBy: [
                sortName === 'asc' ? { name: 'asc' } : sortName === 'desc' ? { name: 'desc' } : {},
            ],
            skip,
            take: pageSize,
            ...baseQuery
        });

        return {
            results,
            totalPages,
            currentPage: totalResults,
        };
    } catch (error) {
        return {
            error: 'An error occurred while paginating results.',
        };
    }
}

export { paginateResults };
