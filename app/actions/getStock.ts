"use server";

import { unstable_cache } from "next/cache";

import type { FinnhubQuote } from "finnhub";

// The friendly shape for your app
export interface StockData {
  symbol: string;
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

export interface StockHistoryItem {
  time: number;
  price: number;
}

export interface StockHistory {
  symbol: string;
  data: StockHistoryItem[];
  resolution: string;
}

interface FinnhubCandles {
  c: number[];
  h: number[];
  l: number[];
  o: number[];
  s: string;
  t: number[];
  v: number[];
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
          symbol: s,
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
    [`stock-data-${symbol}`], // Unique cache key per symbol
    { revalidate: 60, tags: ["stock-data"] },
  );

  return getCachedStock(symbol);
}

export async function getStockHistory(
  symbol: string,
  resolution: string,
  from: number,
  to: number,
): Promise<StockHistory> {
  // Round from and to timestamps to the nearest 5 minutes to improve cache hit rate
  const roundedFrom = Math.floor(from / 300) * 300;
  const roundedTo = Math.floor(to / 300) * 300;

  const getCachedHistory = unstable_cache(
    async (s: string, res: string, f: number, t: number) => {
      const apiKey = process.env.FINNHUB_API_KEY;
      if (!apiKey) {
        throw new Error("Server misconfiguration: API Key missing");
      }

      const url = `https://finnhub.io/api/v1/stock/candle?symbol=${s}&resolution=${res}&from=${f}&to=${t}&token=${apiKey}`;
      const response = await fetch(url);
      
      if (response.status === 403) {
        console.warn(`Finnhub API: History (candles) is a premium feature for ${s}. Falling back to mock data for UI testing.`);
        return generateMockHistory(s, res, f, t);
      }

      const text = await response.text();

      if (!response.ok) {
        console.error(`Finnhub API Error (${response.status}):`, text);
        throw new Error(`Finnhub API Error: ${response.statusText}`);
      }

      try {
        const rawData: FinnhubCandles = JSON.parse(text);

        if (rawData.s !== "ok") {
          return { symbol: s, data: [], resolution: res };
        }

        const data = rawData.t.map((timestamp, index) => ({
          time: timestamp,
          price: rawData.c[index],
        }));

        return {
          symbol: s,
          data,
          resolution: res,
        };
      } catch (e) {
        console.error("Failed to parse Finnhub response as JSON:", text);
        throw new Error("Invalid JSON response from Finnhub");
      }
    },
    [`stock-history-${symbol}-${resolution}`],
    { revalidate: 300, tags: ["stock-history"] },
  );

  return getCachedHistory(symbol, resolution, roundedFrom, roundedTo);
}

/**
 * Generates realistic-looking mock data for testing UI charts
 * when the official API endpoint is restricted.
 */
async function generateMockHistory(
  symbol: string,
  resolution: string,
  from: number,
  to: number,
): Promise<StockHistory> {
  // Try to get the current price to make the mock data realistic
  let startPrice = 150;
  try {
    const quote = await getCompanyStock(symbol);
    startPrice = quote.currentPrice;
  } catch (e) {
    // Fallback if quote also fails
  }

  const data: StockHistoryItem[] = [];
  const duration = to - from;
  
  // Determine number of points based on resolution
  let points = 50;
  if (resolution === "5") points = 72; // 6 hours of 5-min data
  if (resolution === "30") points = 40; // ~2 days of 30-min data
  if (resolution === "D") points = 30; // 1 month of daily
  if (resolution === "W") points = 52; // 1 year of weekly

  const step = Math.floor(duration / points);
  let currentPrice = startPrice * (0.95 + Math.random() * 0.1); // Start within 5% of current
  
  for (let i = 0; i <= points; i++) {
    const time = from + (i * step);
    // Random walk with slight upward bias
    const change = (Math.random() - 0.48) * (startPrice * 0.01);
    currentPrice += change;
    
    data.push({
      time,
      price: parseFloat(currentPrice.toFixed(2)),
    });
  }

  return { symbol, data, resolution };
}
