import NewsList from "@/components/news-list";
import { getArticlesWithContent } from "./actions/getArticles";
import { getActiveSubscription } from "./actions/getSubscription";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { category } = await searchParams;

  const articles = await getArticlesWithContent(category).then((articles) => {
    console.log("Articles loaded:", articles);
    return articles;
  });

  const isSubscribed = await getActiveSubscription().then(
    (sub) => sub?.status === "active",
  );

  return (
    <div className="bg-card">
      <NewsList
        articles={articles}
        category={category}
        isSubscribed={isSubscribed}
      />
    </div>
  );
}
