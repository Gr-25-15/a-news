"use server";

import { unstable_cache } from "next/cache";

import type { FinnhubQuote } from "finnhub";

// The friendly shape for your app
export interface StockData {
  currentPrice: number;
  change: number;
  percentChange: number;
  highPrice: number;
  lowPrice: number;
  openPrice: number;
  previousClose: number;
  timestamp: number;
  cachedAt: string;
}

export async function getCompanyStock(symbol: string): Promise<StockData> {
  const getCachedStock = unstable_cache(
    async (s: string) => {
      const apiKey = process.env.FINNHUB_API_KEY;
      if (!apiKey) {
        throw new Error("Server misconfiguration: API Key missing");
      }

      const url = `https://finnhub.io/api/v1/quote?symbol=${s}&token=${apiKey}`;
      const response = await fetch(url);
      const text = await response.text();

      if (!response.ok) {
        console.error(`Finnhub API Error (${response.status}):`, text);
        throw new Error(`Finnhub API Error: ${response.statusText}`);
      }

      try {
        const rawData: FinnhubQuote = JSON.parse(text);

        // Map cryptic keys to friendly names
        return {
          currentPrice: rawData.c,
          change: rawData.d,
          percentChange: rawData.dp,
          highPrice: rawData.h,
          lowPrice: rawData.l,
          openPrice: rawData.o,
          previousClose: rawData.pc,
          timestamp: rawData.t,
          cachedAt: new Date().toISOString(),
        };
      } catch (e) {
        console.error("Failed to parse Finnhub response as JSON:", text);
        throw new Error("Invalid JSON response from Finnhub");
      }
    },
    ["stock-data"], // Cache key prefix
    { revalidate: 60, tags: ["stock-data"] },
  );

  return getCachedStock(symbol);
}
