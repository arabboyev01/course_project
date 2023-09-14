import { S3ClientConfig } from '@aws-sdk/client-s3';
const region = process.env.AWS_REGION;
const s3Config: S3ClientConfig|any = {
    region: region,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
};

export { region, s3Config}