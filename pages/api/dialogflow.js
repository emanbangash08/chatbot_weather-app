import axios from 'axios';

const API_KEY = 'ae769ed00455bb7a0eacbcc987d7c953';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Only POST requests allowed');
  }

  const body = req.body;
  const intentName = body.queryResult.intent.displayName;
  const parameters = body.queryResult.parameters;
  const city = parameters['geo-city'] || 'Delhi';
  const date = parameters['date'];

  try {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    // --- intent: weatherinfo ---
    if (intentName === 'weatherinfo') {
      const response = await axios.get(weatherUrl);
      const { description } = response.data.weather[0];
      const { temp } = response.data.main;

      return res.status(200).json({
        fulfillmentText: `The current weather in ${city} is ${description} with a temperature of ${temp}°C.`,
      });
    }

    // --- intent: weatherinfo-humidity ---
    if (intentName === 'weatherinfo-humidity') {
      const response = await axios.get(weatherUrl);
      const humidity = response.data.main.humidity;

      return res.status(200).json({
        fulfillmentText: `The humidity level in ${city} is currently around ${humidity}%.`,
      });
    }

    // --- intent: weatherinfo-wind ---
    if (intentName === 'weatherinfo-wind') {
      const response = await axios.get(weatherUrl);
      const wind = response.data.wind.speed;

      return res.status(200).json({
        fulfillmentText: `The wind speed in ${city} is about ${wind} meters per second.`,
      });
    }

    // --- intent: weatherinfo-airquality ---
    if (intentName === 'weatherinfo-airquality') {
      const coordRes = await axios.get(weatherUrl);
      const { lon, lat } = coordRes.data.coord;

      const aqiUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
      const aqiRes = await axios.get(aqiUrl);

      const aqi = aqiRes.data.list[0].main.aqi;
      const levels = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];

      return res.status(200).json({
        fulfillmentText: `The air quality in ${city} is ${levels[aqi - 1]} (AQI level ${aqi}).`,
      });
    }

    // --- intent: weatherinfo-weekforecast ---
    if (intentName === 'weatherinfo-weekforecast') {
      const forecastRes = await axios.get(forecastUrl);
      const forecastList = forecastRes.data.list;
      const daily = {};

      forecastList.forEach(item => {
        const date = new Date(item.dt_txt).toDateString();
        if (!daily[date]) {
          daily[date] = {
            temp: item.main.temp,
            desc: item.weather[0].description
          };
        }
      });

      let msg = `Here's the weekly forecast for ${city}:\n`;
      Object.entries(daily).slice(0, 5).forEach(([day, data]) => {
        msg += `${day}: ${data.desc}, ${data.temp}°C\n`;
      });

      return res.status(200).json({
        fulfillmentText: msg.trim(),
      });
    }

    // --- intent: weatherinfo-tomorrow ---
    if (intentName === 'weatherinfo-tomorrow') {
      const forecastRes = await axios.get(forecastUrl);
      const forecastList = forecastRes.data.list;

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const match = forecastList.find(item => {
        const itemDate = new Date(item.dt_txt);
        return itemDate.toDateString() === tomorrow.toDateString();
      });

      if (match) {
        const desc = match.weather[0].description;
        const temperature = match.main.temp;

        return res.status(200).json({
          fulfillmentText: `The forecast for tomorrow in ${city} is ${desc} with a temperature of around ${temperature}°C.`,
        });
      } else {
        return res.status(200).json({
          fulfillmentText: `Sorry, I couldn't find the forecast for tomorrow in ${city}.`,
        });
      }
    }

    // --- intent: weatherinfo-clothing ---
    if (intentName === 'weatherinfo-clothing') {
      const response = await axios.get(weatherUrl);
      const temp = response.data.main.temp;
      let suggestion = "a light jacket and casual wear";

      if (temp < 10) suggestion = "a heavy coat and warm clothes";
      else if (temp < 20) suggestion = "a sweater or light jacket";
      else if (temp > 30) suggestion = "light clothing like shorts and a T-shirt";

      return res.status(200).json({
        fulfillmentText: `In ${city}, it's currently ${temp}°C. You should wear ${suggestion}.`,
      });
    }

    // --- fallback ---
    return res.status(200).json({
      fulfillmentText: `I'm not sure how to help with that.`,
    });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      fulfillmentText: 'Sorry, there was an error fetching weather data.',
    });
  }
}
