import NewsList from "@/components/news-list";
import { getArticlesWithContent } from "./actions/getArticles";
import MarketFetcher from "@/components/market-fetcher";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const articles = await getArticlesWithContent(category);

  return (
    <>
      <NewsList articles={articles} category={category} />
      <MarketFetcher />
    </>
  );
}
