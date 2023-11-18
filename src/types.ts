import { JwtPayload } from 'jsonwebtoken'
import { Request } from 'express'

export interface SeachQueryParams {
    name?: string
    groupName?: string
    latest?: string
}

export interface BaucketParams {
    Bucket: string
    Key: string
    Body: Buffer
    ContentType: string
}

export interface PaginationResult<T> {
    results?: T[];
    totalPages?: number
    currentPage?: number
    error?: string
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
    likedBy: string
    imageUrl: string | undefined
    comments: Comment[]
    ratings: Rating[]
    userType: string
}

export interface Review {
    id: number
    name: string
    groupName: string
    tags: Tag[]
    reviewText: string
    imageUrl?: string | null
    ratings: Rating[]
    grade: number
    isLiked: boolean
    likes: Like[]
    createdAt: string
    comments: Comment[]
    userId: number
}

export type Rating = {
    id: number
    ratingNum: number
    reviewId: number
    userId: number
    review: Review[]
    user: User[]
}
export interface PartialRating {
    id: number
    ratingNum: number
    reviewId: number
    userId: number
}

export type Like = {
    id: number
    userId: number
    reviewId: number
    user: User[]
    review: Review[]
}

export interface PartialLike {
    id: number
    userId: number
    reviewId: number
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

export interface PartialReview {
    review: Review[]
    user: User
    tags: Tag[]
    ratings: Rating[]
    likes: Like[]
}

export type DecodedToken = JwtPayload | string

export interface CustomRequest extends Request {
    user: number;
    admin: boolean;
}
export interface UploadedImageTypes {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}