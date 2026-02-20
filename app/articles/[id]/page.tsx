"use server";
import { getArticleById } from "@/app/actions/getArticles";
import AdminDisplayArticle from "@/components/admin-dashboard/admin-article-display";
import { getCategoryFormData } from "@/app/actions/getCategories";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

type Params = Promise<{ id: string }>;

export default async function AdminArticlePage({ params }: { params: Params }) {
  const { id } = await params;

  const categories = await getCategoryFormData();
  const article = await getArticleById(id);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const perm = session?.user.role === "admin";

  return (
    <AdminDisplayArticle
      article={article}
      articleId={id}
      categories={categories}
      isAdmin={perm}
    />
  );
}
