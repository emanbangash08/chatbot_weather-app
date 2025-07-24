// pages/api/dialogflow.js

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
  const date = parameters['date']; // may be undefined

  try {
    // 🌤️ Intent: weatherinfo
    if (intentName === 'weatherinfo') {
      if (!date || isToday(date)) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        const response = await axios.get(url);
        const { description } = response.data.weather[0];
        const { temp } = response.data.main;

        return res.status(200).json({
          fulfillmentText: `The current weather in ${city} is ${description} with a temperature of ${temp}°C.`,
        });
      } else {
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
        const forecastRes = await axios.get(forecastUrl);
        const forecastList = forecastRes.data.list;
        const target = new Date(date);

        const match = forecastList.find((item) => {
          const itemDate = new Date(item.dt_txt);
          return itemDate.toDateString() === target.toDateString();
        });

        if (match) {
          const desc = match.weather[0].description;
          const temperature = match.main.temp;
          return res.status(200).json({
            fulfillmentText: `The forecast for ${city} on ${target.toDateString()} is ${desc} with a temperature around ${temperature}°C.`,
          });
        } else {
          return res.status(200).json({
            fulfillmentText: `Sorry, I couldn't find the forecast for that date in ${city}.`,
          });
        }
      }
    }

    // 💧 Intent: weatherinfo - humidity
    if (intentName === 'weatherinfo - humidity') {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
      const response = await axios.get(url);
      const humidity = response.data.main.humidity;

      return res.status(200).json({
        fulfillmentText: `The humidity level in ${city} is currently around ${humidity}%.`,
      });
    }

    // ❓ Unknown intent fallback
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

function isToday(dateString) {
  const today = new Date();
  const input = new Date(dateString);
  return today.toDateString() === input.toDateString();
}
