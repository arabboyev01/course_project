import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { fromIni } from '@aws-sdk/credential-provider-ini'

const s3Client = new S3Client({
    region: 'ap-southeast-1',
    credentials: fromIni()

});

const uploadImageToS3 = async (imageBuffer: Buffer, originalName: string): Promise<string> => {
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
