import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { LucideIcon, ArrowUp, ArrowDown } from "lucide-react";
import { symbolIcons } from "@/app/utils/weatherIcons";
import { getSwedenWeather } from "@/app/actions/getWeather";
import { Series } from "@/app/types/weather";

function calculateHighLow(timeseries: Series[]) {
  const next24h = timeseries.slice(0, 24);
  const temps = next24h.map((s) => s.temp);
  return {
    high: Math.max(...temps),
    low: Math.min(...temps),
  };
}

export default async function WeatherWidget() {
  const weatherData = await getSwedenWeather();

  if (!weatherData || weatherData.length === 0) {
    return (
      <Card className="w-full border-dashed">
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          No weather data available.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {weatherData.map((weather) => {
        const current = weather.timeseries[0];
        const { high, low } = calculateHighLow(weather.timeseries);
        const Icon: LucideIcon = symbolIcons[current.symbol] || symbolIcons[28];

        return (
          <Card
            key={weather.location.place_id}
            className="py-0 overflow-hidden border-muted/40 hover:bg-muted/50 transition-colors cursor-default"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col">
                  <span className="font-bold text-sm tracking-tight">
                    {weather.location.name}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {current.summary}
                  </span>
                </div>
                <Icon className="h-8 w-8 text-primary/80" strokeWidth={1.5} />
              </div>

              <div className="flex items-end justify-between mt-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold tracking-tighter">
                    {Math.round(current.temp)}°
                  </span>
                </div>

                <div className="flex gap-2">
                  <div className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-900/50">
                    <ArrowUp className="h-3 w-3 mr-0.5" />
                    {Math.round(high)}°
                  </div>
                  <div className="flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-1.5 py-0.5 rounded-md border border-blue-100 dark:border-blue-900/50">
                    <ArrowDown className="h-3 w-3 mr-0.5" />
                    {Math.round(low)}°
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
