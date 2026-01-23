import { finnhub } from "finnhub";
import { NextRequest, NextResponse } from "next/server";

const finnhubClient = new finnhub.DefaultApi(process.env.FINNHUB_API_KEY || "");

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return new Response("Symbol query parameter is required", { status: 400 });
  }

  try {
    const stockData = await new Promise((resolve, reject) => {
      finnhubClient.quote(symbol, (error: any, data: any, response: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });

    return NextResponse.json(stockData);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: "Error fetching stock data", details: message }), { status: 500 });
  }
}
