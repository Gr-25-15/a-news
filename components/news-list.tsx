"use client";

import { Article } from "@/app/generated/prisma/client";
import { IsaacCard } from "./IsaacCard"; // Match exactly!

interface NewsListProps {
  articles: Article[];
  category: string | undefined;
}

export default function NewsList({ articles, category }: NewsListProps) {
  // If no articles, show a clean "Empty" state so it doesn't look broken
  if (!articles || articles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center border-2 border-dashed border-gray-200 rounded-xl mt-10">
        <h3 className="text-xl font-bold text-gray-400">Här var det tomt!</h3>
        <p className="text-gray-500">
          Kör seed-skriptet för att hämta nyheter.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* 🇸🇪 Editorial Header */}
      <div className="mb-12 border-b-8 border-black pb-4">
        <h2 className="text-6xl font-black uppercase tracking-tighter italic">
          {category ?? "Senaste Nytt"}
        </h2>
      </div>

      {/* 📱 3-Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {articles.map((article) => (
          <IsaacCard
            key={article.id}
            title={article.title}
            // Mapping DB fields to your Stylish Card
            description={
              article.description ?? "Ingen beskrivning tillgänglig."
            }
            isLocked={article.isSubscriberOnly} // Using your team's exact DB field name
            category={category ?? "Nyheter"}
            // S3 URL or fallback photo
            imageUrl={
              article.imageUrl ??
              "https://images.unsplash.com/photo-1504711432869-5d39a110fdd7?q=80&w=1000"
            }
          />
        ))}
      </div>
    </div>
  );
}
