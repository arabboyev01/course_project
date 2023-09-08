const baseQuery = {
    include: {
        tags: {
            select: {
                name: true,
                id: true,
            },
        },
        user: {
            select: {
                firstName: true,
                lastName: true,
                email: true,
                imageUrl: true,
                username: true,
                id: true,
            },
        },
    },
};

export { baseQuery }