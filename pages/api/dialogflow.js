import axios from 'axios';

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
app.use(bodyParser.json());

const API_KEY = 'ae769ed00455bb7a0eacbcc987d7c953';

app.post('/webhook', async (req, res) => {
  const intent = req.body.queryResult.intent.displayName;
  const city = req.body.queryResult.parameters['geo-city'] || 'Lahore';

  const getLatLon = async (city) => {
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
    const geoRes = await axios.get(geoUrl);
    return geoRes.data[0]; // contains lat & lon
  };

  try {
    switch (intent) {
      case 'WeatherIntent': {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const temp = response.data.main.temp;
        const description = response.data.weather[0].description;
        return res.json({
          fulfillmentText: `In ${city}, it is currently ${description} with a temperature of ${temp}°C.`,
        });
      }

      case 'WeatherTomorrowIntent': {
        const forecast = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        const tomorrowData = forecast.data.list[8]; // Approx 24 hours ahead
        const desc = tomorrowData.weather[0].description;
        const temp = tomorrowData.main.temp;
        return res.json({
          fulfillmentText: `Tomorrow in ${city}, expect ${desc} with a temperature around ${temp}°C.`,
        });
      }

      case 'WeekForecastIntent': {
        const forecast = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        const days = forecast.data.list.filter((item, index) => index % 8 === 0);
        const summary = days.map(day => {
          const date = new Date(day.dt_txt).toDateString();
          return `${date}: ${day.weather[0].main}, ${day.main.temp}°C`;
        }).join('\n');
        return res.json({
          fulfillmentText: `5-day forecast for ${city}:\n${summary}`,
        });
      }

      case 'HumidityIntent': {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const humidity = response.data.main.humidity;
        return res.json({
          fulfillmentText: `The humidity in ${city} is ${humidity}%.`,
        });
      }

      case 'WindIntent': {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const windSpeed = response.data.wind.speed;
        const windDir = response.data.wind.deg;
        return res.json({
          fulfillmentText: `The wind in ${city} is blowing at ${windSpeed} m/s at ${windDir}°.`,
        });
      }

      case 'AirQualityIntent': {
        const { lat, lon } = await getLatLon(city);
        const aqi = await axios.get(
          `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        const aqiValue = aqi.data.list[0].main.aqi;
        const levels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
        return res.json({
          fulfillmentText: `Air quality in ${city} is ${aqiValue} (${levels[aqiValue - 1]}).`,
        });
      }

      case 'ClothingIntent': {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const temp = response.data.main.temp;
        let suggestion = '';
        if (temp < 10) suggestion = "Wear a warm coat and gloves.";
        else if (temp < 20) suggestion = "A light jacket or sweater should be good.";
        else suggestion = "It’s warm! T-shirt weather.";
        return res.json({
          fulfillmentText: `It's ${temp}°C in ${city}. ${suggestion}`,
        });
      }

      default:
        return res.json({ fulfillmentText: "Sorry, I didn’t get that." });
    }
  } catch (err) {
    console.error(err);
    return res.json({
      fulfillmentText: `Oops! Something went wrong. Please try again later.`,
    });
  }
});

app.listen(3001, () => console.log('Webhook server running on port 3001'));
