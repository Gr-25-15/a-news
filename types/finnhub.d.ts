declare module "finnhub" {
  export class DefaultApi {
    constructor(apiKey: string);

    /**
     * Get real-time quotes for symbols.
     * @param symbol Symbol
     * @param callback Callback function
     */
    quote(symbol: string, callback: (error: Error | null, data: FinnhubQuote, response: FinnhubResponse) => void): void;
  }

  export interface FinnhubQuote {
    c: number; // Current price
    d: number; // Change
    dp: number; // Percent change
    h: number; // High price of the day
    l: number; // Low price of the day
    o: number; // Open price of the day
    pc: number; // Previous close price
    t: number; // Timestamp
  }

  export interface FinnhubResponse {
    status: number;
    text: string;
    body: FinnhubQuote;
    header: object;
  }
}
