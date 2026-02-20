"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { s3Client, S3_BUCKET } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";

export async function getAllArticles() {
  return await prisma.article.findMany();
}

export async function createArticle(
  title: string,
  categoryId: string,
  isPublished: boolean,
  isSubscriberOnly: boolean,
  thumbnailUrl?: string,
  description?: string,
  content?: string,
) {
  try {
    // Check permissions
    const { success } = await auth.api.userHasPermission({
      headers: await headers(),
      body: {
        permissions: {
          article: ["create"],
        },
      },
    });
    if (!success) {
      throw new Error("unauthorized");
    }

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }
    const authorId = session.user.id;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const filename = `${slug}-${randomUUID()}.md`;
    const s3Key = `articles/${filename}`;

    // Upload to S3
    console.log(`Uploading content to S3: ${s3Key}`);
    await s3Client.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: s3Key,
        Body: content,
        ContentType: "text/markdown",
        ACL: "public-read",
      }),
    );

    const contentUrl = `${process.env.S3_ENDPOINT}/${S3_BUCKET}/${s3Key}`;

    // Create Article in DB
    const article = await prisma.article.create({
      data: {
        title,
        contentUrl: contentUrl,
        categoryId,
        authorId: authorId,
        description,
        isPublished,
        isSubscriberOnly,
        thumbnailUrl,
      },
    });

    revalidatePath("/");
    console.log(`Successfully created article: ${title}`);
    return { success: true, article: article };
  } catch (e) {
    console.error(`Error processing topic "${title}":`, e);
    return { success: false, error: "Failed to create article" };
  }
}
export async function editArticle(
  title: string,
  categoryId: string,
  isPublished: boolean,
  isSubscriberOnly: boolean,
  id: string,
  thumbnailUrl?: string,
  description?: string,
  content?: string,
) {
  const { success } = await auth.api.userHasPermission({
    headers: await headers(),
    body: {
      permissions: {
        article: ["edit"],
      },
    },
  });
  if (!success) {
    return { success: false, error: "Unauthorized" };
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }
  const editorId = session.user.id;

  try {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const filename = `${slug}-${randomUUID()}.md`;
    const s3Key = `articles/${filename}`;

    // Upload to S3
    console.log(`Uploading content to S3: ${s3Key}`);
    await s3Client.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: s3Key,
        Body: content,
        ContentType: "text/markdown",
        ACL: "public-read",
      }),
    );

    const contentUrl = `${process.env.S3_ENDPOINT}/${S3_BUCKET}/${s3Key}`;

    const article = await prisma.article.update({
      where: {
        id,
      },
      data: {
        title,
        contentUrl: contentUrl,
        categoryId,
        authorId: editorId,
        description,
        isPublished,
        isSubscriberOnly,
        thumbnailUrl,
      },
    });

    revalidatePath("/");
    console.log(`Successfully created article: ${title}`);
    return { success: true, article: article };
  } catch (e) {
    console.error(`Error processing topic "${title}":`, e);
    return { success: false, error: "Failed to create article" };
  }
}

export async function deleteArticle(id: string) {
  const { success } = await auth.api.userHasPermission({
    headers: await headers(),
    body: {
      permissions: {
        article: ["delete"],
      },
    },
  });
  if (!success) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    await prisma.article.delete({
      where: {
        id,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to delete article" };
  }
}
