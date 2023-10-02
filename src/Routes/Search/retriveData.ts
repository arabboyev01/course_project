import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function retrieveDataFromDatabase() {
    return await prisma.review.findMany()
}

export { retrieveDataFromDatabase }