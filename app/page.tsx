"use client";
import { useState } from "react";
import { getCompanyStock } from "./actions/getStock";
import { ComponentExample } from "@/components/component-example";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShadcnTemplate } from "@/components/ui/richTextEditor/shadcnTemplate";

import type { StockData } from "./actions/getStock";

export default function Page() {
  const [stockData, setStockData] = useState<StockData | null>(null);

  return (
    <>
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
      <ShadcnTemplate />
    </>
  );
}
