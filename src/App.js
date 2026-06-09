import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [rainAlert, setRainAlert] = useState(false);

  const API_KEY = "34962ac0caa7c65b12890f34a36dcfbb";

  useEffect(() => {
    Notification.requestPermission();

    checkWeatherAutomatically();

    const interval = setInterval(() => {
      checkWeatherAutomatically();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const showRainNotification = () => {
    if (Notification.permission === "granted") {
      new Notification("🌧 Rain Alert!", {
        body: "Rain detected near your location. Carry an umbrella!",
        icon: "https://openweathermap.org/img/wn/10d@2x.png",
      });
    }
  };

  const checkWeatherAutomatically = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );

          const condition =
            response.data.weather[0].main;

          if (
            condition === "Rain" ||
            condition === "Drizzle" ||
            condition === "Thunderstorm"
          ) {
            setRainAlert(true);
            showRainNotification();
          } else {
            setRainAlert(false);
          }
        } catch (error) {
          console.log(error);
        }
      }
    );
  };

  const getWeather = async () => {
    if (!city) return;

    setLoading(true);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      setWeather(response.data);
    } catch (error) {
      alert("City not found!");
    }

    setLoading(false);
  };
    const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        setLoading(true);

        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );

          setWeather(response.data);

          const condition =
            response.data.weather[0].main;

          if (
             condition === "Rain" ||
            condition === "Drizzle" ||
            condition === "Thunderstorm" 
           
          ) {
            setRainAlert(true);
            showRainNotification();
          } else {
            setRainAlert(false);
          }
        } catch (error) {
          alert("Unable to fetch location weather");
        }

        setLoading(false);
      }
    );
  };

  return (
    <div className={darkMode ? "app dark" : "app light"}>

      {rainAlert && (
        <div className="rain-alert">
          🌧 Rain Alert! Rain detected near your location.
        </div>
      )}

      <div className="weather-card">

        <button
          className="theme-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode
            ? "☀ Light Mode"
            : "🌙 Dark Mode"}
        </button>

        <h1>🌤 Weather Dashboard Pro</h1>

        <p className="subtitle">
          Real-Time Weather Information System
        </p>

        <h3>
          Current Mode:
          {darkMode ? " 🌙 Dark" : " ☀ Light"}
        </h3>

        <p>{new Date().toLocaleString()}</p>

        <div className="search-box">

          <input
            type="text"
            placeholder="Enter City Name..."
            value={city}
            onChange={(e) =>
              setCity(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                getWeather();
              }
            }}
          />

          <button onClick={getWeather}>
            Search
          </button>

        </div>

        <button
          className="location-btn"
          onClick={getLocation}
        >
          📍 Use My Location
        </button>

        {loading && (
          <div className="loader"></div>
        )}

        {weather && (
          <div className="weather-info">

            <h2>{weather.name}</h2>

            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather"
            />

            <h3>
              {weather.main.temp}°C
            </h3>

            <p>
              ☁️ {weather.weather[0].description}
            </p>

            <p>
              🌡 Feels Like:
              {weather.main.feels_like}°C
            </p>

                        <p>
              💧 Humidity:
              {weather.main.humidity}%
            </p>

            <p>
              🌬 Wind Speed:
              {weather.wind.speed} m/s
            </p>

            <p>
              🔽 Pressure:
              {weather.main.pressure} hPa
            </p>

            <p>
              👀 Visibility:
              {(weather.visibility / 1000).toFixed(1)} km
            </p>

            <p>
              🌅 Sunrise:
              {" "}
              {new Date(
                weather.sys.sunrise * 1000
              ).toLocaleTimeString()}
            </p>

            <p>
              🌇 Sunset:
              {" "}
              {new Date(
                weather.sys.sunset * 1000
              ).toLocaleTimeString()}
            </p>

          </div>
        )}

        <div className="footer">
          © 2026 Weather Dashboard Pro
          <br />
          Developed by Manjunath
          <br />
          Powered by OpenWeather API
        </div>

      </div>
    </div>
  );
}

export default App;