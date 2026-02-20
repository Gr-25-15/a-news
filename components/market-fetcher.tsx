"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getCompanyStock,
  getStockHistory,
  type StockData,
  type StockHistoryItem,
} from "@/app/actions/getStock";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { Loader2, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const COMPANIES = [
  { symbol: "AAPL", name: "Apple" },
  { symbol: "MSFT", name: "Microsoft" },
  { symbol: "GOOGL", name: "Google" },
  { symbol: "AMZN", name: "Amazon" },
  { symbol: "TSLA", name: "Tesla" },
  { symbol: "NVDA", name: "Nvidia" },
  { symbol: "META", name: "Meta" },
];

const TIME_SCALES = [
  { label: "1D", resolution: "5", days: 1 },
  { label: "5D", resolution: "30", days: 5 },
  { label: "1M", resolution: "D", days: 30 },
  { label: "6M", resolution: "D", days: 180 },
  { label: "1Y", resolution: "W", days: 365 },
] as const;

type TimeScale = (typeof TIME_SCALES)[number];

export default function MarketFetcher() {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedSymbol, setExpandedSymbol] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<StockHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [currentTimeScale, setCurrentTimeScale] = useState<TimeScale>(
    TIME_SCALES[0],
  );

  const fetchAllStocks = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await Promise.all(
        COMPANIES.map((c) => getCompanyStock(c.symbol)),
      );
      setStocks(data);
    } catch (error) {
      console.error("Failed to fetch stocks:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllStocks();
  }, []);

  const fetchHistory = async (symbol: string, timeScale: TimeScale) => {
    setLoadingHistory(true);
    try {
      const now = Math.floor(Date.now() / 1000);
      const from = now - timeScale.days * 24 * 60 * 60;
      const history = await getStockHistory(
        symbol,
        timeScale.resolution,
        from,
        now,
      );
      setHistoryData(history.data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleRowClick = (symbol: string) => {
    if (expandedSymbol === symbol) {
      setExpandedSymbol(null);
    } else {
      setExpandedSymbol(symbol);
      fetchHistory(symbol, currentTimeScale);
    }
  };

  const handleTimeScaleChange = (e: React.MouseEvent, scale: TimeScale) => {
    e.stopPropagation();
    setCurrentTimeScale(scale);
    if (expandedSymbol) {
      fetchHistory(expandedSymbol, scale);
    }
  };

  if (loading) {
    return (
      <Card className="w-full my-4 p-8 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground animate-pulse">
          Loading market data...
        </p>
      </Card>
    );
  }

  return (
    <Card className="w-full my-4 py-0 overflow-hidden shadow-sm border-muted/40 relative group">
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          fetchAllStocks(true);
        }}
        disabled={refreshing}
        className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm shadow-sm z-10"
      >
        <RefreshCcw className={cn("h-3 w-3", refreshing && "animate-spin")} />
      </Button>

      <CardContent className="p-0">
        <Table>
          <TableBody>
            {stocks.map((stock) => (
              <React.Fragment key={stock.symbol}>
                <TableRow
                  className={cn(
                    "cursor-pointer transition-colors border-b",
                    expandedSymbol === stock.symbol
                      ? "bg-muted/30"
                      : "hover:bg-muted/50",
                  )}
                  onClick={() => handleRowClick(stock.symbol)}
                >
                  <TableCell className="pl-4 py-3 pr-1">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm tracking-tight">
                        {stock.symbol}
                      </span>
                      <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                        {COMPANIES.find((c) => c.symbol === stock.symbol)?.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-3 px-1 text-sm font-mono font-medium">
                    ${stock.currentPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right py-3 pl-1 pr-4">
                    <Badge
                      variant={stock.change >= 0 ? "outline" : "destructive"}
                      className={cn(
                        "font-mono px-1.5 py-0.5 text-xs h-5",
                        stock.change >= 0 &&
                          "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-900",
                      )}
                    >
                      {stock.change >= 0 ? "+" : ""}
                      {stock.percentChange.toFixed(1)}%
                    </Badge>
                  </TableCell>
                </TableRow>
                {expandedSymbol === stock.symbol && (
                  <TableRow className="hover:bg-transparent border-b-0">
                    <TableCell colSpan={3} className="p-0 border-b">
                      <div className="px-3 py-5 bg-muted/5">
                        <div className="flex items-center justify-between mb-4 px-1">
                          <div className="flex gap-1.5 overflow-x-auto">
                            {TIME_SCALES.map((scale) => (
                              <button
                                key={scale.label}
                                className={cn(
                                  "px-2 py-1 text-xs font-semibold rounded-md transition-all",
                                  currentTimeScale.label === scale.label
                                    ? "bg-background text-foreground shadow-sm border"
                                    : "text-muted-foreground hover:text-foreground",
                                )}
                                onClick={(e) => handleTimeScaleChange(e, scale)}
                              >
                                {scale.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="h-[180px] w-full">
                          {loadingHistory ? (
                            <div className="h-full flex flex-col items-center justify-center gap-1">
                              <Loader2 className="h-5 w-5 animate-spin text-primary/30" />
                            </div>
                          ) : historyData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={historyData}
                                margin={{
                                  top: 5,
                                  right: 10,
                                  left: -20,
                                  bottom: 0,
                                }}
                              >
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  vertical={false}
                                  stroke="hsl(var(--muted))"
                                  opacity={0.3}
                                />
                                <XAxis dataKey="time" hide />
                                <YAxis
                                  domain={["auto", "auto"]}
                                  tick={{ fontSize: 10 }}
                                  tickFormatter={(val) => `$${Math.round(val)}`}
                                  axisLine={false}
                                  tickLine={false}
                                />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: "hsl(var(--background))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "8px",
                                    fontSize: "11px",
                                    padding: "6px 10px",
                                  }}
                                  labelFormatter={(unixTime) =>
                                    format(
                                      new Date(unixTime * 1000),
                                      "MMM d, p",
                                    )
                                  }
                                  formatter={(value: number) => [
                                    `$${value.toFixed(2)}`,
                                    "",
                                  ]}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="price"
                                  stroke={
                                    stock.change >= 0 ? "#10b981" : "#ef4444"
                                  }
                                  dot={false}
                                  strokeWidth={2.5}
                                  animationDuration={1000}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="h-full flex items-center justify-center text-xs text-muted-foreground border border-dashed rounded-lg">
                              No data
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
