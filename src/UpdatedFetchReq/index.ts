import { PrismaClient } from '@prisma/client'
import { baseQuery } from '../utils/baseQuery'
const prisma = new PrismaClient()

async function fetchUpdatedReviewData(reviewId: number) {
    const review = await prisma.review.findUnique({
        where: { id: reviewId },
        ...baseQuery
    })
    
    if (!review) {
        throw new Error(`Review with ID ${reviewId} not found`)
    }
    
    return review
}

export { fetchUpdatedReviewData }
