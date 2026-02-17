import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getS3Content } from "@/lib/s3";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { customMdxComponents } from "@/lib/mdx-components";

type Params = Promise<{ id: string }>;

export default async function ArticlePage({ params }: { params: Params }) {
  const { id } = await params;

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      Category: true,
      Author: true,
    },
  });

  if (!article) {
    notFound();
  }

  let content = "";
  try {
    const url = new URL(article.contentUrl);
    const pathParts = url.pathname.split("/");
    const key = pathParts.slice(2).join("/");
    content = await getS3Content(key);
  } catch (err) {
    console.error("Failed to fetch article content:", err);
    content = "# Error\nFailed to load article content from storage.";
  }

  return (
    <main className="container mx-auto py-10 px-4">
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
          <div className="mb-8 overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.thumbnailUrl}
              alt={article.title}
              className="w-full h-auto object-cover max-h-125"
            />
          </div>
        )}

        <div className="prose-ui w-full">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={customMdxComponents as Components}
          >
            {content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
