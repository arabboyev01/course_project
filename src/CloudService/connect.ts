import { S3Client, PutObjectCommand, S3ClientConfig } from '@aws-sdk/client-s3';
// import { fromIni } from '@aws-sdk/credential-provider-ini'
process.env.AWS_SDK_LOAD_CONFIG = 'true';

// const s3Config: S3ClientConfig = {
//     region: process.env.AWS_REGION,
//     credentials: {
//         accessKeyId: "AKIA5LCOOCBQ7W5DDE3Y",
//         secretAccessKey: "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",
//     },
// };
// @ts-ignore
const s3Client = new S3Client({ profile: 'profilename' });

const uploadImageToS3 = async (imageBuffer: Buffer | undefined, originalName: string | undefined): Promise<string> => {
    const uniqueName = 'images/' + Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + originalName;

    const params: any = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: uniqueName,
        Body: imageBuffer,
        ContentType: 'image/jpeg'
    }

    try {
        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        return `https://${params.Bucket}.s3.${s3Client.config.region}.amazonaws.com/${uniqueName}`;
    } catch (error) {
        throw error
    }
};

export { uploadImageToS3 };