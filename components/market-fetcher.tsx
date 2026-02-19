"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCompanyStock } from "@/app/actions/getStock";
import type { StockData } from "@/app/actions/getStock";

export default function MarketFetcher() {
  const [stockData, setStockData] = useState<StockData | null>(null);

  return (
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
        {stockData && <pre className="mt-4 p-2 bg-muted rounded overflow-auto max-h-40">{JSON.stringify(stockData, null, 2)}</pre>}
      </div>
    </Card>
  );
}
