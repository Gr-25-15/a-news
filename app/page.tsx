import { IsaacCard } from "@/components/IsaacCard";
import { getArticlesWithContent } from "./actions/getArticles";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const articles = await getArticlesWithContent(category);

  // Check your terminal! If this says 0, your database is empty.
  console.log(`Loaded ${articles.length} articles for IsaacCard`);

  return (
    <main className="py-8 px-4 md:px-0">
      {/* HEADER WITH LIVE SMART FEED */}
      <div className="mb-10 border-b-[12px] border-[#F2FFE1] pb-4 flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1">
            Editorial / {category || "Global"}
          </p>
          <h2 className="text-5xl font-[1000] italic uppercase tracking-tighter text-foreground">
            {category || "Latest Stories"}
          </h2>
        </div>

        <div className="hidden sm:flex items-center gap-3 mb-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F2FFE1] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F2FFE1]"></span>
          </span>
          <span className="text-[11px] font-[1000] uppercase tracking-[0.2em] text-foreground">
            LIVE SMART FEED
          </span>
        </div>
      </div>

      {/* THE ISAAC GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.length > 0 ? (
          articles.map((article) => (
            <IsaacCard key={article.id} article={article} />
          ))
        ) : (
          <div className="col-span-full py-32 text-center border-4 border-dashed border-[#F2FFE1]/20">
            <p className="text-[#F2FFE1] font-black uppercase tracking-[.5em] animate-pulse">
              Connecting to News Protocol...
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
