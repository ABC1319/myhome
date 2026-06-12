import React, { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, Snowflake, Wind, Droplets, CloudLightning, Search, RefreshCw, MapPin } from "lucide-react";
import { WeatherInfo } from "../types";

export default function Weather() {
  const [city, setCity] = useState(() => {
    return localStorage.getItem("homepage_city") || "Shanghai";
  });
  const [searchInp, setSearchInp] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Fetch weather data from direct wttr.in public API
  const fetchWeather = async (targetCity: string) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`https://wttr.in/${encodeURIComponent(targetCity)}?format=j1&lang=zh`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      
      // Map wttr.in data structure to WeatherInfo
      const current = data.current_condition[0];
      setWeatherData({
        city: targetCity,
        temp: parseInt(current.temp_C, 10),
        condition: current.weatherDesc[0].value.includes("晴") ? "sunny" : 
                   current.weatherDesc[0].value.includes("雨") ? "rainy" : 
                   current.weatherDesc[0].value.includes("雪") ? "snowy" : "cloudy",
        description: current.weatherDesc[0].value,
        humidity: current.humidity + "%",
        windSpeed: current.windspeedKmph + "km/h",
        icon: "" // Not needed with current mapping
      });
      localStorage.setItem("homepage_city", targetCity);
    } catch (e) {
      setErrorMsg(`天气加载失败: ${e instanceof Error ? e.message : '未知原因'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  // Handle Search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInp.trim()) {
      setCity(searchInp.trim());
      fetchWeather(searchInp.trim());
      setSearchInp("");
      setShowSearch(false);
    }
  };

  // Render weather icon based on mapped condition
  const renderWeatherIcon = (condition: string, size = 28) => {
    const iconClass = "text-indigo-600 drop-shadow-[0_0_8px_rgba(99,102,241,0.2)]";
    switch (condition?.toLowerCase()) {
      case "sunny":
        return <Sun size={size} className="text-amber-550 animate-spin-slow drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]" />;
      case "rainy":
        return <CloudRain size={size} className="text-cyan-500 animate-bounce-slow" />;
      case "snowy":
        return <Snowflake size={size} className="text-sky-400 animate-pulse" />;
      case "thunder":
        return <CloudLightning size={size} className="text-yellow-500 animate-pulse" />;
      case "windy":
        return <Wind size={size} className="text-teal-500" />;
      case "cloudy":
      default:
        return <Cloud size={size} className={iconClass} />;
    }
  };

  return (
    <div id="weather_widget" className="relative group glass-panel rounded-2xl p-4 flex flex-col justify-between h-full min-h-[140px] text-left transition-all">
      {/* Upper header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono">
          <MapPin size={12} className="text-indigo-600" />
          <span className="font-semibold uppercase tracking-wider">
            {weatherData?.city || city}
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className="p-1 hover:bg-black/5 rounded-full text-slate-600 hover:text-indigo-600 transition-colors"
            title="搜索城市"
          >
            <Search size={13} />
          </button>
          <button 
            onClick={() => fetchWeather(city)}
            className={`p-1 hover:bg-black/5 rounded-full text-slate-600 hover:text-indigo-600 transition-colors ${isLoading ? "animate-spin" : ""}`}
            title="刷新天气"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* Main weather body */}
      {showSearch ? (
        <form onSubmit={handleSearch} className="my-2 flex items-center gap-1.5 animate-fadeIn">
          <input
            type="text"
            value={searchInp}
            onChange={(e) => setSearchInp(e.target.value)}
            placeholder="拼音, 如: Beijing"
            className="flex-1 text-xs px-2.5 py-1.5 rounded-lg glass-input text-slate-800 placeholder-slate-400 font-sans"
            autoFocus
          />
          <button
            type="submit"
            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-xs font-semibold select-none cursor-pointer transition-colors"
          >
            搜索
          </button>
        </form>
      ) : isLoading ? (
        <div className="flex-1 flex items-center justify-center my-2">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : errorMsg ? (
        <div className="flex-1 flex items-center justify-center my-2 text-red-500 text-xs font-semibold">
          {errorMsg}
        </div>
      ) : weatherData ? (
        <div className="flex-1 flex items-center justify-between my-2 animate-fadeIn">
          {/* Temperature and description */}
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-display font-semibold text-slate-800 tracking-tighter">
              {weatherData.temp}
            </span>
            <span className="text-sm text-indigo-600 font-mono">°C</span>
            <span className="ml-2 text-xs text-slate-600 font-sans tracking-wide self-end pb-1 inline-block bg-slate-100 px-1.5 py-0.5 rounded">
              {weatherData.description}
            </span>
          </div>
          {/* Action icon visualizer */}
          <div className="bg-white/50 p-2 rounded-xl border border-slate-200/50 shadow-inner">
            {renderWeatherIcon(weatherData.condition, 26)}
          </div>
        </div>
      ) : null}

      {/* Footer weather metrics */}
      {!showSearch && !isLoading && weatherData && (
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1.5 border-t border-slate-200/50">
          <div className="flex items-center gap-1">
            <Droplets size={10} className="text-sky-500" />
            <span>湿度: {weatherData.humidity}</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind size={10} className="text-teal-600" />
            <span>风速: {weatherData.windSpeed}</span>
          </div>
        </div>
      )}
    </div>
  );
}
