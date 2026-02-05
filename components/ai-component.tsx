"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { generateArticle } from "@/lib/ai";
import { parseArticleResponse } from "@/lib/utils";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getArticlesWithContent } from "@/app/actions/getArticles";

interface ArticleWithContent {
  id: string;
  title: string;
  content: string;
}

export default function AiComponent() {
  const [prompt, setPrompt] = useState("");
  const [preview, setPreview] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const [articles, setArticles] = useState<ArticleWithContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const data = await getArticlesWithContent();
        setArticles(data);
      } catch (err) {
        console.error("Failed to fetch articles:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="flex flex-col gap-8 p-8 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Enter a topic..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button
          disabled={isLoading}
          onClick={async () => {
            setIsLoading(true);
            const text = await generateArticle(prompt);
            setPreview(parseArticleResponse(text));
            setIsLoading(false);
          }}
        >
          {isLoading ? "Generating..." : "Generate Article"}
        </Button>
      </div>

      {preview && (
        <div className="p-8 border rounded-xl bg-card shadow-lg ring-1 ring-border">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">
            Generated Preview
          </h2>
          <h1 className="text-4xl font-extrabold mb-8 tracking-tight">
            {preview.title}
          </h1>
          <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-p:text-lg">
            <Markdown remarkPlugins={[remarkGfm]}>{preview.content}</Markdown>
          </article>
        </div>
      )}

      <div className="flex flex-col gap-12 mt-8">
        <h2 className="text-3xl font-bold border-b pb-4">Latest News</h2>
        {isLoading && articles.length === 0 ? (
          <p>Loading articles...</p>
        ) : (
          articles.map((art) => (
            <div key={art.id} className="group relative flex flex-col gap-4">
              <h3 className="text-3xl font-bold group-hover:text-primary transition-colors">
                {art.title}
              </h3>
              <article className="prose prose-slate dark:prose-invert max-w-none prose-p:text-gray-600 dark:prose-p:text-gray-300">
                <Markdown remarkPlugins={[remarkGfm]}>{art.content}</Markdown>
              </article>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
