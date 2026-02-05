import prisma from "@/lib/prisma";

export async function createArticle(
  title: string,
  contentUrl: string,
  id: string,
  userId: string,
  authorId: string,
  categoryId: string,
  editorId: string,
) {
  const result = await prisma.article.create({
    data: {
      title,
      contentUrl,
      id,
      userId,
      authorId,
      categoryId,
      editorId,
    },
  });
  if (!result) {
    return false;
  }
  return true;
}
