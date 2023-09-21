import { PrismaClient } from "@prisma/client"
import { baseQuery } from "../utils/baseQuery"
const prisma = new PrismaClient();

async function fetchUpdatedReviewData(reviewId: number) {
    try {
        const review = await prisma.review.findUnique({
            where: { id: reviewId },
            ...baseQuery
        });

        if (review) return review;
         else throw new Error(`Review with ID ${reviewId} not found`);
    
    } catch (error) {
        throw error;
    }
}

export { fetchUpdatedReviewData };
