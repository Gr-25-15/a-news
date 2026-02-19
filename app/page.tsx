"use client";

import { useEffect, useState } from "react";
import { getCompanyStock } from "./actions/getStock";
import { ComponentExample } from "@/components/component-example";
import { Card } from "@/components/ui/card";
import { ShadcnTemplate } from "@/components/ui/richTextEditor/shadcnTemplate";
import type { StockData } from "./actions/getStock";
import AiComponent from "@/components/ai-component";
import CreateArticle from "@/components/create-article-form";
import { getCategoryFormData } from "./actions/getCategories";

// --- Added card import ---
import NewsList from "@/components/news-list";
import { Button } from "@/components/ui/button";
import { getArticlesWithContent } from "./actions/getArticles";
import { Article } from "./generated/prisma/client";

export interface ArticleWithContent {
  id: string;
  title: string;
  content: string;
}

export default function Page() {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const data = await getArticlesWithContent();
        setArticles(data);
        console.log("Fetched articles:", data);
      } catch (err) {
        console.error("Failed to fetch articles:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <>
      <NewsList articles={articles} />
      <Card className="p-4 mb-4 w-md m-auto">
        <h2 className="text-lg font-semibold mb-2">Market Data Fetcher</h2>
        <p>Click the button below to fetch stock data for Apple Inc. (AAPL).</p>
        <div>
          <Button
            onClick={async () => {
              const data = await getCompanyStock("AAPL");
              setStockData(data);
            }}
          >
            Fetch AAPL Stock Data
          </Button>
          {stockData && <pre>{JSON.stringify(stockData, null, 2)}</pre>}
        </div>
      </Card>

      {/*<Card className="p-4 mb-4 w-md m-auto">
        <AiComponent />
      </Card>
      <ShadcnTemplate />*/}
    </>
  );
}
