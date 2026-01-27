"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Weather } from "../app/types/weather";
import { LocateFixed, LucideIcon } from "lucide-react";
import { symbolIcons } from "@/app/utils/weatherIcons";

export default function WeatherComponent() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [error, setError] = useState<string | null>(null);

  const weatherApiUrl = process.env.NEXT_PUBLIC_WEATHER_API_URL;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setWeather(null);
    setError(null);

    if (!weatherApiUrl) {
      setError("Weather API URL is not defined.");
      return;
    }

    const response = await fetch(
      `${weatherApiUrl}forecast/location/${location}`,
    );

    if (!response.ok) {
      setError("Please enter a valid location.");
    }

    const data = await response.json();

    setWeather(data);
    setError(null);
  }
  return (
    <div className="max-w-45 inline-block p-2 shadow-sm border">
      <form onSubmit={handleSubmit} className="flex items-center">
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter a location"
        />
        <Button>
          <LocateFixed />
        </Button>
      </form>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      {weather &&
        weather.timeseries.length > 0 &&
        (() => {
          const current = weather.timeseries[0];
          const Icon: LucideIcon =
            symbolIcons[current.symbol] || symbolIcons[28];

          return (
            <div className="mt-3 w-full">
              <div className="flex items justify-between mr-1">
                <h2 className="font-semibold truncate">
                  {weather.location.name}
                </h2>
                <Icon className="w-6 h-86flex-shrink-0" />
              </div>
              <p className="font-extralight">{weather.timeseries[0].summary}</p>
              <p>Temperature: {weather.timeseries[0].temp}°C</p>
            </div>
          );
        })()}
    </div>
  );
}
