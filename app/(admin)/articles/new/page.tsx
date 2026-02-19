import { getCategoryFormData } from "@/app/actions/getCategories";
import CreateOrEditArticle from "@/components/create-edit-article-form";

export default async function CreateArticlePage() {
  const categories = await getCategoryFormData();

  return <CreateOrEditArticle categories={categories} />;
}
