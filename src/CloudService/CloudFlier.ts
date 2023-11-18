import { UploadedImageTypes } from '../types'
import { Storage } from '@google-cloud/storage'

export const uploadImageToGoogleCloud = async (imageData: UploadedImageTypes): Promise<string> => {
    const storage = new Storage({
        projectId: 'final-project-400517',
        keyFilename: '/Users/mac/Desktop/CourseProject_back/serviceAccountKey.json',
    })

    const bucketName = 'cloud_course_project'
    const uploadDestination = 'images/' + imageData.originalname
    const fileUpload = storage.bucket(bucketName).file(uploadDestination)

    return new Promise((resolve, reject) => {
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: imageData.mimetype,
            },
            resumable: false,
        })

        blobStream.on('error', (err) => {
            reject(err)
        })

        blobStream.on('finish', () => {
            return resolve(`https://storage.cloud.google.com/${bucketName}/${uploadDestination}`)
        })

        blobStream.end(imageData.buffer)
    })
}