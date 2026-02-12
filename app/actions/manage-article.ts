"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function getAllArticles() {
  return await prisma.article.findMany();
}

export async function createArticle(
  id: string,
  contentUrl: string,
  authorId: string,
  categoryId: string,
  userId: string,
  title: string,
  imageKey?: string,
  featuredImage?: string,
  editorId?: string,
  type?: string,
) {
  const { success } = await auth.api.userHasPermission({
    headers: await headers(),
    body: {
      permissions: {
        article: ["create"],
      },
    },
  });
  if (!success) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    await prisma.article.create({
      data: {
        id,
        contentUrl,
        authorId,
        categoryId,
        userId,
        title,
        editorId,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Failed to create article" };
  }
}

export async function editArticle(
  id: string,
  contentUrl: string,
  authorId: string,
  categoryId: string,
  userId: string,
  title: string,
  imageKey?: string,
  featuredImage?: string,
  editorId?: string,
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
  try {
    await prisma.article.update({
      where: {
        id,
      },
      data: {
        contentUrl,
        authorId,
        categoryId,
        userId,
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
