import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function retrieveDataFromDatabase() {
    try {
        const reviews = await prisma.review.findMany();
        return reviews;
    } catch (error) {
        throw error;
    }
}

export { retrieveDataFromDatabase }