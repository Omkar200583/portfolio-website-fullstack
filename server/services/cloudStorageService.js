import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { logger } from "../utils/logger.js";

// npm install @aws-sdk/client-s3
//
// Required env vars:
//   AWS_ACCESS_KEY_ID
//   AWS_SECRET_ACCESS_KEY
//   AWS_REGION
//   AWS_S3_BUCKET
//
// If your bucket is private (recommended for interview recordings), swap the
// returned public URL below for a signed URL using @aws-sdk/s3-request-presigner:
//   import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
//   import { GetObjectCommand } from "@aws-sdk/client-s3";
//   const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET, Key: key }), { expiresIn: 604800 });

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET;

/**
 * Upload a file buffer to S3 and return its URL.
 * @param {Buffer} buffer
 * @param {string} key - e.g. "interviews/<sessionId>/recording-<ts>.webm"
 * @param {string} contentType
 */
export const uploadToS3 = async (buffer, key, contentType) => {
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    );
    return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    logger.error(`S3 upload error: ${error.message}`);
    throw error;
  }
};
