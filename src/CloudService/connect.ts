import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { BaucketParams } from '../types'
import { s3Config, region } from './credentials'

const s3Client = new S3Client(s3Config)

const uploadImageToS3 = async (imageBuffer: Buffer | undefined, originalName: string | undefined): Promise<string> => {

    if (!imageBuffer || !originalName) {
        throw new Error('Image buffer and original name are required.')
    }

    const uniqueName = `images/${Date.now()}-${Math.round(Math.random() * 1E9)}.jpeg`

    const params: BaucketParams = {
        Bucket: 'coursename',
        Key: uniqueName,
        Body: imageBuffer as Buffer,
        ContentType: 'image/jpeg',
    }
    const command = new PutObjectCommand(params)
    await s3Client.send(command)

    return `https://coursename.s3.${region}.amazonaws.com/${uniqueName}`

}

export { uploadImageToS3 }