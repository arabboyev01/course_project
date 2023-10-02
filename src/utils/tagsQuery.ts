import { PrismaClient } from '.prisma/client'

const prisma = new PrismaClient()

const tagsQuery = async (tagsArray: string[]) => {
    const tagIds = []

    for (const tagName of tagsArray) {
        const existingTag = await prisma.tag.findUnique({
            where: {
                name: tagName,
            },
        })

        if (existingTag) {
            tagIds.push(existingTag.id)
        } else {
            const newTag = await prisma.tag.create({
                data: {
                    name: tagName,
                },
            })
            tagIds.push(newTag.id)
        }
    }

    return tagIds
}

export { tagsQuery }