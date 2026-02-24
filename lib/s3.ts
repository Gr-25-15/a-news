import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "./auth";
import https from "https";

export const s3Client = new S3Client({
  region: process.env.S3_REGION!,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
  requestHandler: {
    httpsAgent: new https.Agent({
      rejectUnauthorized: process.env.NODE_ENV === "development" ? false : true,
    }),
  },
});

export const S3_BUCKET = process.env.S3_BUCKET!;

export async function getS3Content(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
  });

  try {
    const response = await s3Client.send(command);
    const bodyContents = await response.Body?.transformToString();
    return bodyContents || "";
  } catch (error) {
    console.error("Error fetching S3 content");
    return "";
  }
}

export async function getUploadUrl(filename: string, contentType: string) {
  const session = auth.api.getSession();
  if (!session) {
    return undefined;
  }

  const key = `articles/${Date.now()}-${filename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    ContentType: contentType,
    ACL: "public-read",
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  const fileUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${key}`;

  return { uploadUrl: signedUrl, fileUrl, key };
}
