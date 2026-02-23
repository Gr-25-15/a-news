"use server";

import prisma from "@/lib/prisma";
import { getS3Content } from "@/lib/s3";
import type { Article } from "../generated/prisma/client";
import { notFound } from "next/navigation";

export async function extractContent(article: Article) {
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
  return content;
}

export async function getArticleById(id: string) {
  const article = await prisma.article.findUnique({
    where: {
      id: id,
    },
    include: {
      Category: true,
      Author: true,
      Editor: true,
    },
  });

  if (!article) {
    notFound();
  }

  const content = await extractContent(article);
  return {
    ...article,
    content,
  };
}

export type articleFull = Awaited<ReturnType<typeof getArticleById>>;
export type articleList = Awaited<ReturnType<typeof getAllArticles>>;

export async function getAllArticles() {
  const articles = await prisma.article.findMany({
    include: {
      Category: true,
      Author: true,
      Editor: true,
    },
  });
  return articles;
}

export async function getArticlesWithContent(categoryName?: string) {
  const articles = await prisma.article.findMany({
    where:
      categoryName && categoryName !== "All"
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
      Author: true,
      Editor: true,
    },
  });

  const articlesWithContent = await Promise.all(
    articles.map(async (article) => {
      const content = await extractContent(article);

      return {
        ...article,
        content,
      };
    }),
  );

  return articlesWithContent;
}
