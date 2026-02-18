"use client";

import { useState } from "react";
import { getCompanyStock } from "./actions/getStock";
import { ComponentExample } from "@/components/component-example";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShadcnTemplate } from "@/components/ui/richTextEditor/shadcnTemplate";
import type { StockData } from "./actions/getStock";
import AiComponent from "@/components/ai-component";

// --- Added card import ---
import { IsaacCard } from "@/components/IsaacCard";

export default function Page() {
  const [stockData, setStockData] = useState<StockData | null>(null);

  return (
    <>
      {/* --- Alex: New Isaac Cards start  --- */}
      <section className="p-8 bg-slate-50 border-b mb-10">
        <h1 className="text-xl font-bold mb-6 text-center text-slate-800 uppercase tracking-tight">
          Isaac News Component
        </h1>
        <div className="flex gap-6 justify-center flex-wrap">
          <IsaacCard
            title="LOREM IPSUM"
            description="Card Description - Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            isLocked={true}
          />
          <IsaacCard
            title="LOREM IPSUM"
            description="Card Description - Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            isLocked={false}
          />
        </div>
      </section>
      {/* --- END OF ISSAC CARD --- */}

      {/* --- Earlier Code --- */}
      <ComponentExample />
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

      <Card className="p-4 mb-4 w-md m-auto">
        <AiComponent />
      </Card>
      <ShadcnTemplate />
     
    </>
  );
}
