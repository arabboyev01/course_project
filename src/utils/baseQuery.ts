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
                likedBy: true,
                comments: true,
                ratings: true
            },
        },
        comments: {
            select: {
                id: true,
                text: true,
                userId: true,
                reviewId: true,
                createdAt: true,
            }
        },
        ratings: {
            select: {
                id: true,
                ratingNum: true,
                reviewId: true,
                userId: true,
            }
        },
        likes: {
            select: {
                userId: true,
            }
        }
    },
};

export { baseQuery }