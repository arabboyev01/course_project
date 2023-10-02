import { S3ClientConfig } from '@aws-sdk/client-s3'
const region = process.env.AWS_REGION as string
const AccessKeyId = process.env.AWS_ACCESS_KEY_ID as string
const SecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY as string

const s3Config: S3ClientConfig = {
    region: region,
    credentials: {
        accessKeyId: AccessKeyId,
        secretAccessKey: SecretAccessKey,
    },
}

export { region, s3Config}