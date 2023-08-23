import AWS from "aws-sdk";
import fs from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { fromBase64 } from "@aws-sdk/util-base64-node"
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity"
// AWS.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: 'ap-southeast-1'
// });

// @ts-ignore
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        client: fromCognitoIdentityPool({
            // @ts-ignore
            identityPoolId: process.env.AWS_COGNITO_IDENTITY_POOL_ID 
        })
    }
})


const uploadImageToS3 = async (imagePath: any) => {
    const imageKey = 'images/' + Date.now() + '-' + Math.round(Math.random() * 1E9);
    const putObjectParams = {
        Bucket: 'arn:aws:s3:::courseprojects',
        Key: imageKey,
        Body: fromBase64(imagePath),
        ContentType: 'image/jpeg'
    };

    return putObjectParams
};

export { uploadImageToS3, s3 };
