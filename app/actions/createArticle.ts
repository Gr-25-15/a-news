"use server";
import prisma from "@/lib/prisma";
import { s3Client, S3_BUCKET } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function createArticle(
  title: string,
  userId: string,
  authorId: string,
  categoryId: string,
  type: string,
  content?: string,
  editorId?: string,
) {
  try {
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
        title: title,
        contentUrl: contentUrl,
        categoryId: categoryId,
        authorId: authorId,
        userId: userId,
        editorId: editorId,
        type: type,
      },
    });
    console.log(`Successfully created article: ${title}`);
    return article;
  } catch (e) {
    console.error(`Error processing topic "${title}":`, e);
  }
}
