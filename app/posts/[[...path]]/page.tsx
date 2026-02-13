import { notFound } from "next/navigation";
import { allPosts } from "content-collections";
import { mdxComponents } from "@prose-ui/next";
import { MDXContent } from "@content-collections/mdx/react";

type Params = Promise<{ path: string[] }>;
type PageProps = {
  params: Params;
};

const findPage = (pathArr: string[]) => {
  const path = pathArr ? `${pathArr.join("/")}` : "/";
  return allPosts.find((page) => page._meta.path === path);
};

export async function generateStaticParams() {
  return allPosts.map((page) => ({
    path: page._meta.path.slice(1).split("/"),
  }));
}

export default async function Page({ params }: PageProps) {
  const { path } = await params;
  const page = findPage(path);
  if (!page) notFound();

  return (
    <article className="prose-ui w-full max-w-5xl mx-auto">
      <MDXContent code={page.mdx} components={mdxComponents} />
    </article>
  );
}
