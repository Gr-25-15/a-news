"use server";

import { getUploadUrl } from "@/lib/s3";

type GetUploadUrlSuccess = {
  success: true;
  uploadUrl: string;
  fileUrl: string;
  key: string;
};
type GetUploadUrlError = {
  success: false;
  error: string;
};
export type GetUploadUrlResponse = GetUploadUrlSuccess | GetUploadUrlError;

/**
 * Server action to get a presigned URL for uploading a file to S3.
 * This acts as a secure bridge between the client and the S3 library function.
 * @param filename - The name of the file.
 * @param contentType - The MIME type of the file.
 * @returns An object with either the upload details or an error.
 */
export async function getUploadUrlAction(
  filename: string,
  contentType: string,
): Promise<GetUploadUrlResponse> {
  try {
    const result = await getUploadUrl(filename, contentType);
    if (!result) {
      throw new Error("Authentication failed or unable to get upload URL.");
    }
    return { success: true, ...result };
  } catch (error) {
    console.error("Error getting upload URL:", error);
    const message = (error as Error).message || "An unknown error occurred";
    return { success: false, error: message };
  }
}