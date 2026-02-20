import NewsList from "@/components/news-list";
import { getArticlesWithContent } from "./actions/getArticles";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const articles = await getArticlesWithContent(category);

  return (
    <div className="bg-card">
      <NewsList articles={articles} category={category} />
    </div>
  );
}
