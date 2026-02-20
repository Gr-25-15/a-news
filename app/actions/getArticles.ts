"use server";

import prisma from "@/lib/prisma";
import { getS3Content } from "@/lib/s3";

export async function getArticlesWithContent(categoryName?: string) {
  const articles = await prisma.article.findMany({
    where: categoryName && categoryName !== "All"
      ? {
          Category: {
            name: {
              equals: categoryName,
              mode: "insensitive",
            },
          },
        }
      : {},
    include: {
      Category: true,
    },
  });

  const articlesWithContent = await Promise.all(
    articles.map(async (article) => {
      // contentUrl is something like http://.../bucket/articles/filename.md
      // We need to extract the key.
      const url = new URL(article.contentUrl);
      const pathParts = url.pathname.split("/");
      // Path usually starts with /bucket/key
      // For Minio/S3 ForcePathStyle: /bucket/articles/filename.md
      // We want articles/filename.md
      const key = pathParts.slice(2).join("/");

      let content = "";
      try {
        content = await getS3Content(key);
      } catch (err) {
        console.error(`Failed to fetch content for ${key}:`, err);
        content = "Failed to load content.";
      }

      return {
        ...article,
        content,
      };
    })
  );

  return articlesWithContent;
}
