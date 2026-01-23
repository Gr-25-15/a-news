"use server";

export async function getCompanyStock(symbol: string) {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    console.error("FINNHUB_API_KEY is missing from environment variables.");
    throw new Error("Server misconfiguration: API Key missing");
  }

  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
  
  const response = await fetch(url, { next: { revalidate: 60 } });
  
  const text = await response.text();

  if (!response.ok) {
    console.error(`Finnhub API Error (${response.status}):`, text);
    throw new Error(`Finnhub API Error: ${response.statusText}`);
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse Finnhub response as JSON:", text);
    throw new Error("Invalid JSON response from Finnhub");
  }
}
