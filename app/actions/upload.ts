"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { s3Client, S3_BUCKET } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export async function uploadImage(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  // Check if user has permission to create articles (or a specific upload permission)
  const { success: hasPermission } = await auth.api.userHasPermission({
    headers: await headers(),
    body: {
      permissions: {
        article: ["create"],
      },
    },
  });

  if (!hasPermission) {
    return { success: false, error: "Unauthorized: Missing permissions" };
  }

  const file = formData.get("file") as File;
  if (!file) {
    return { success: false, error: "No file provided" };
  }

  // Server-side validation
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { success: false, error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: "File too large. Maximum size is 10MB." };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const extension = file.name.split(".").pop();
    const filename = `${randomUUID()}.${extension}`;
    const key = `uploads/${filename}`;

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    // Construct the public URL
    // Note: In production you might want to use a CDN or a custom domain
    const fileUrl = `${process.env.S3_ENDPOINT}/${S3_BUCKET}/${key}`;

    return { success: true, url: fileUrl };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Failed to upload image" };
  }
}
