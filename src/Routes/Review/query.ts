export const query = {
    include: {
        user: {
            select: {
                firstName: true,
                lastName: true,
                email: true,
                username: true,
                imageUrl: true,
            },
        },
        tags: {
            select: {
                name: true,
                id: true,
            },
        },
    },
}