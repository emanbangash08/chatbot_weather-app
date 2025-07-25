"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
  MapPin,
  Droplets,
  Wind,
  Search,
  CloudRain,
  Sun,
  Cloud,
  CloudSnow,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null)
  const [city, setCity] = useState("Lahore")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true)
      try {
        const API_KEY = "ae769ed00455bb7a0eacbcc987d7c953"
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
        )
        setWeather(response.data)
      } catch (err) {
        console.error("Error fetching weather:", err)
        setWeather(null)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [city])

  const getWeatherIcon = (weatherMain) => {
    switch (weatherMain?.toLowerCase()) {
      case "clear":
        return <Sun className="w-8 h-8 text-yellow-500" />
      case "clouds":
        return <Cloud className="w-8 h-8 text-gray-500" />
      case "rain":
      case "drizzle":
        return <CloudRain className="w-8 h-8 text-blue-500" />
      case "snow":
        return <CloudSnow className="w-8 h-8 text-blue-200" />
      default:
        return <Cloud className="w-8 h-8 text-gray-500" />
    }
  }

  const getTemperatureColor = (temp) => {
    if (temp >= 30) return "text-red-500"
    if (temp >= 20) return "text-orange-500"
    if (temp >= 10) return "text-yellow-500"
    return "text-blue-500"
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-blue-50 via-white to-blue-50 border-0 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          <div className="p-2 bg-blue-100 rounded-full">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          Weather Overview
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl h-12 text-base"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : weather ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="text-xl font-semibold text-gray-800">
                  {weather.name}
                </span>
              </div>
              {getWeatherIcon(weather.weather[0].main)}
            </div>

            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
              <div
                className={`text-5xl font-bold ${getTemperatureColor(
                  weather.main.temp,
                )} mb-2`}
              >
                {Math.round(weather.main.temp)}°C
              </div>
              <p className="text-gray-600 capitalize text-lg font-medium">
                {weather.weather[0].description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600">
                    Humidity
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-800">
                  {weather.main.humidity}%
                </p>
              </div>

              <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">
                    Wind Speed
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-800">
                  {weather.wind.speed} m/s
                </p>
              </div>
            </div>

            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Feels like:</span>
                  <span className="ml-2 font-semibold text-gray-800">
                    {Math.round(weather.main.feels_like)}°C
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Pressure:</span>
                  <span className="ml-2 font-semibold text-gray-800">
                    {weather.main.pressure} hPa
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
              <p className="text-red-600 font-medium">
                Enter city to know a today&apos;s Forecast
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
