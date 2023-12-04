import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function retrieveDataFromDatabase() {
    try {
        return  await prisma.review.findMany()
    } catch (error) {
        console.error('Error retrieving data:', error)
    }
}

export { retrieveDataFromDatabase }