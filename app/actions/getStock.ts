"use server";

import { unstable_cache } from "next/cache";

export async function getCompanyStock(symbol: string) {
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
        const data = JSON.parse(text);
        return { ...data, cachedAt: new Date().toISOString() };
      } catch (e) {
        console.error("Failed to parse Finnhub response as JSON:", text);
        throw new Error("Invalid JSON response from Finnhub");
      }
    },
    ["stock-data"], // Cache key prefix
    { revalidate: 60, tags: ["stock-data"] }
  );

  return getCachedStock(symbol);
}
