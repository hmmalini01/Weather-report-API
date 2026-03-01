import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Weather.css";

function Weather() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bgClass, setBgClass] = useState("default-bg");
  const [currentTime, setCurrentTime] = useState(new Date());

  const API_KEY = "107ecd06495df40e687af7188e746753";

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const setBackground = (weatherMain, icon) => {
    const isNight = icon.includes("n");

    if (weatherMain.includes("Cloud")) setBgClass("cloud-bg");
    else if (weatherMain.includes("Rain")) setBgClass("rain-bg");
    else if (weatherMain.includes("Clear"))
      setBgClass(isNight ? "night-bg" : "sunny-bg");
    else setBgClass("default-bg");
  };

  const getWeather = async () => {
    if (!city) return;

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=107ecd06495df40e687af7188e746753&units=metric`
      );

      setWeatherData(response.data);
      setBackground(
        response.data.weather[0].main,
        response.data.weather[0].icon
      );

      setLoading(false);
    } catch {
      setWeatherData(null);
      setError("City not found!");
      setLoading(false);
    }
  };

  return (
    <div className={`weather-wrapper ${bgClass}`}>

      {/* Weather Effects */}
      {bgClass === "rain-bg" && <div className="rain"></div>}
      {bgClass === "cloud-bg" && <div className="cloud"></div>}
      {bgClass === "sunny-bg" && <div className="sun"></div>}
      {bgClass === "night-bg" && <div className="moon"></div>}

      <div className="weather-card">
        <h1>🌦 Smart Weather</h1>

        <div className="date-time">
          {currentTime.toLocaleDateString()} <br />
          {currentTime.toLocaleTimeString()}
        </div>

        {/* Search Box */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={getWeather}>Search</button>
        </div>

        {/* Loader */}
        {loading && <div className="loader"></div>}

        {/* Error */}
        {error && <p className="error">{error}</p>}

        {/* Weather Data */}
        {weatherData && (
          <>
            <h2 className="temperature">
              {weatherData.main.temp}°C
            </h2>

            <p className="feels-like">
              Feels Like: {weatherData.main.feels_like}°C 🌡️
            </p>

            <div className="details">
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt="icon"
              />
              <p>{weatherData.weather[0].description}</p>
              <p>Humidity: {weatherData.main.humidity}%</p>
              <p>Wind: {weatherData.wind.speed} m/s</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Weather;