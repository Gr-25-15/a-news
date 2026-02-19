"use client";

import { Article } from "@/app/generated/prisma/client";
import { NewsCard } from "./news-card";
import { ArticleWithContent } from "@/app/page";

interface NewsListProps {
  articles: Article[];
}

export default function NewsList({ articles }: NewsListProps) {
  if (!articles) return null;

  return (
    <section className="p-8 bg-background border-b mb-10">
      <h1 className="text-xl font-bold mb-6 text-center text-accent uppercase tracking-tight">
        Isaac News Component
      </h1>
      <div className="flex gap-6 justify-center flex-wrap">
        {articles.map((article) => (
          <NewsCard
            key={article.id}
            title={article.title}
            description={article.description ?? ""}
            isLocked={article.isSubscriberOnly}
          />
        ))}
      </div>
    </section>
  );
}
