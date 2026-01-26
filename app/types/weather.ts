export interface Weather {
  lat: number
  lon: number
  referenceTime: string
  approvedTime: string
  timeseries: Series[]
  location: Location
}

export interface Series {
  validTime: string
  airPressure: number
  temp: number
  visibility: number
  windDirection: number
  windSpeed: number
  humidity: number
  thunderProbability: number
  cloudCover: number
  lowerCloudCover: number
  higherCloudCover: number
  windGust: number
  precipitationMin: number
  precipitationMax: number
  precipitationFrozen: number
  precipitationCategoryValue: number
  precipitationCategory: string
  precipitationMean: number
  precipitationMedian: number
  symbol: number
  summary: string
}

export interface Location {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  lat: string
  lon: string
  category: string
  type: string
  place_rank: number
  importance: number
  addresstype: string
  name: string
  display_name: string
  boundingbox: string[]
}