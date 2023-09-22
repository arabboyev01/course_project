export interface SeachQueryParams {
    name?: string
    groupName?: string
    latest?: string
}

export interface BaucketParams {
    Bucket: any
    Key: string
    Body: any
    ContentType: string
}

export interface PaginationResult<T> {
    results?: T[];
    totalPages?: number;
    currentPage?: number;
    error?: string;
}

export interface RequestQuery {
    selectedTags: string;
    filterName: string;
    sortName: string;
    page: string;
    pageSize: string
}

export type ParsedTags = string[];

export type User = {
    id: number
    username: string
    email: string | undefined
    firstName: string
    lastName: string
    hashPassword: string
    reviews: Review[]
    likedBy: any
    imageUrl: string | undefined
    comments: any
    ratings: any
    userType: string
}

export type Review = {
    id: number
    name: string
    groupName: string
    tags: any
    reviewText: string
    imageUrl: string | undefined
    ratings: any
    grade: number
    isLiked: boolean
    likes: any
    createdAt: string
    comments: any
    userId: number
};

export type Rating = {
    id: number
    ratingNum: number
    reviewId: number
    userId: number
    review: Review[]
    user: User[]
}

export type Like = {
    id: number
    userId: number
    reviewId: number
    user: User[]
    review: Review[]
}

export type Comment = {
    id: number
    text: string
    userId: number
    reviewId: number
    createdAt: string
    user: User[]
    review: Review[]
}

export type Tag = {
    id: number
    name: string
    reviews: Review[]
}