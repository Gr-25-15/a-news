"use client";

import { useState } from "react";
import CreateOrEditArticle from "../create-edit-article-form";
import type { articleFull } from "@/app/actions/getArticles";
import { Option } from "@/app/actions/getCategories";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { customMdxComponents } from "@/lib/mdx-components";
import { sanitizeSchema } from "@/lib/rehype-sanitize-config";

export interface AdminDisplayArticleProps {
  articleId: string;
  article: articleFull;
  categories: Option[];
  isAdmin: boolean;
}

export default function AdminDisplayArticle({
  articleId,
  article,
  categories,
  isAdmin,
}: AdminDisplayArticleProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      {isEditing ? (
        <CreateOrEditArticle articleId={articleId} categories={categories} />
      ) : (
        <main className="container mx-auto py-10 px-4">
          {isAdmin ? (
            <Button type="button" onClick={() => setIsEditing(true)}>
              Edit article
            </Button>
          ) : (
            ""
          )}
          <article className="max-w-4xl mx-auto">
            <header className="mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                  {article.Category.name}
                </span>
                <span>•</span>
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
              <div className="flex items-center gap-3 border-t border-b py-4 mt-6">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">
                    {article.Author.name}
                  </span>
                  <span className="text-xs text-muted-foreground">Author</span>
                </div>
              </div>
            </header>

            {article.thumbnailUrl && (
              <div className="relative mb-8 overflow-hidden rounded-xl aspect-video max-h-125">
                <Image
                  src={article.thumbnailUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              </div>
            )}

            <div className="prose-ui w-full">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
                components={customMdxComponents as Components}
              >
                {article.content}
              </ReactMarkdown>
            </div>
          </article>
        </main>
      )}
    </div>
  );
}
