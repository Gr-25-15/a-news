"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { s3Client, S3_BUCKET } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

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
  const session = await auth.api.getSession();

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

    if (!session) {
      throw new Error("No session");
    }

    const userId = session.user.id;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const filename = `${slug}-${Date.now()}.md`;
    const s3Key = `articles/${filename}`;

    // Upload to S3
    console.log(`Uploading content to S3: ${s3Key}`);
    await s3Client.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: s3Key,
        Body: content,
        ContentType: "text/markdown",
      }),
    );

    const contentUrl = `${process.env.S3_ENDPOINT}/${S3_BUCKET}/${s3Key}`;

    // Create Article in DB
    const article = await prisma.article.create({
      data: {
        title,
        contentUrl: contentUrl,
        categoryId,
        authorId: userId,
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
    return { success: false, error: e };
  }
}
export async function editArticle(
  id: string,
  contentUrl: string,
  categoryId: string,
  userId: string,
  title: string,
  imageKey?: string,
  featuredImage?: string,
  type?: string,
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

  const editorId = (await auth.api.getUser()).id;

  try {
    await prisma.article.update({
      where: {
        id,
      },
      data: {
        contentUrl,
        categoryId,
        title,
        editorId,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Failed to edit article" };
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
  } catch (err) {
    return { success: false, error: "Failed to delete article" };
  }
}
