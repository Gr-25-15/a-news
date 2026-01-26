import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudHail,
  CloudLightning,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudSun,
  Cloudy,
  LucideIcon,
  Rainbow,
  Snowflake,
  Sun,
  SunDim,
} from "lucide-react";

export const symbolIcons: Record<number, LucideIcon> = {
  1: Sun, //Clear sky
  2: SunDim, //Nearly clear sky
  3: CloudSun, //Variable cloudiness
  4: CloudSun, //Halfclear sky
  5: Cloudy, //Cloudy sky
  6: Cloud, //Overcast
  7: CloudFog, //Fog
  8: CloudDrizzle, //Light rain showers
  9: CloudHail, //Moderate rain showers
  10: CloudRain, //Heavy rain showers
  11: CloudLightning, //Thunderstorm
  12: CloudRainWind, //Light sleet showers
  13: CloudRainWind, //Moderate sleet showers
  14: CloudRainWind, //Heavy sleet showers
  15: CloudSnow, //Light snow showers
  16: CloudSnow, //Moderate snow showers
  17: CloudSnow, //Heavy snow showers
  18: CloudDrizzle, //Light rain
  19: CloudHail, //Moderate rain
  20: CloudRain, //Heavy rain
  21: CloudLightning, //Thunder
  22: CloudDrizzle, //	Light sleet
  23: CloudDrizzle, //	Moderate sleet
  24: CloudDrizzle, //	Heavy sleet
  25: CloudSnow, //Light snowfall
  26: Snowflake, //Moderate snowfall
  27: Snowflake, //Heavy snowfall
  28: Rainbow, //fallback
};