"use server";

import { unstable_cache } from "next/cache";
import { Weather } from "../types/weather";

const WEATHER_API_URL = process.env.NEXT_PUBLIC_WEATHER_API_URL;

if (!WEATHER_API_URL) {
  console.warn("NEXT_PUBLIC_WEATHER_API_URL is not defined. Using fallback URL.");
}

const API_BASE = WEATHER_API_URL || "https://weather.lexlink.se/";

export const getCityWeather = unstable_cache(
  async (city: string): Promise<Weather | null> => {
    try {
      const response = await fetch(
        `${API_BASE}forecast/location/${city}`,
        {
          next: { revalidate: 3600 }, // Cache for 1 hour
        }
      );

      if (!response.ok) {
        console.error(`Failed to fetch weather for ${city}: ${response.statusText}`);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching weather for ${city}:`, error);
      return null;
    }
  },
  ["city-weather"],
  { revalidate: 3600, tags: ["weather"] }
);

export async function getSwedenWeather() {
  const cities = ["Stockholm", "Göteborg", "Malmö", "Uppsala", "Kiruna"];
  
  const weatherData = await Promise.all(
    cities.map(async (city) => {
      const data = await getCityWeather(city);
      return data;
    })
  );

  return weatherData.filter((d): d is Weather => d !== null);
}
