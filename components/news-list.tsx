import { Article } from "@/app/generated/prisma/client";
import { NewsCard } from "./news-card";

interface NewsListProps {
  articles: Article[];
  category: string | undefined;
}

export default function NewsList({ articles, category }: NewsListProps) {
  if (!articles) return null;

  return (
    <div className="p-8 border-b mb-10 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-6 text-center uppercase tracking-tight">
        {category ?? "All"} News
      </h1>
      <div className="grid grid-cols-1 gap-6 justify-items-center flex-wrap w-full">
        {articles.map((article) => (
          <NewsCard
            articleThumbnail={article.thumbnailUrl}
            id={article.id}
            key={article.id}
            title={article.title}
            description={article.description ?? ""}
            isLocked={article.isSubscriberOnly}
            isSubscriberOnly={article.isSubscriberOnly}
          />
        ))}
      </div>
    </div>
  );
}
