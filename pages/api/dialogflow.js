import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const intent = req.body.queryResult.intent.displayName;
  const city = req.body.queryResult.parameters['geo-city'] || 'Lahore';
  const API_KEY = 'ae769ed00455bb7a0eacbcc987d7c953';

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
        const desc = response.data.weather[0].description;

        return res.status(200).json({
          fulfillmentText: `In ${city}, it's ${desc} with a temperature of ${temp}°C.`,
        });
      }

      case 'WeatherTomorrowIntent': {
        const forecast = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        const tomorrowData = forecast.data.list[8]; // 24h ahead
        const desc = tomorrowData.weather[0].description;
        const temp = tomorrowData.main.temp;

        return res.status(200).json({
          fulfillmentText: `Tomorrow in ${city}, expect ${desc} with a temperature of ${temp}°C.`,
        });
      }

      case 'WeekForecastIntent': {
        const forecast = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        const days = forecast.data.list.filter((_, i) => i % 8 === 0);
        const summary = days.map((day) => {
          const date = new Date(day.dt_txt).toDateString();
          return `${date}: ${day.weather[0].main}, ${day.main.temp}°C`;
        }).join('\n');

        return res.status(200).json({
          fulfillmentText: `Here is the 5-day forecast for ${city}:\n${summary}`,
        });
      }

      case 'HumidityIntent': {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const humidity = response.data.main.humidity;

        return res.status(200).json({
          fulfillmentText: `The humidity level in ${city} is ${humidity}%.`,
        });
      }

      case 'WindIntent': {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const windSpeed = response.data.wind.speed;
        const windDir = response.data.wind.deg;

        return res.status(200).json({
          fulfillmentText: `Wind speed in ${city} is ${windSpeed} m/s at ${windDir}°.`,
        });
      }

      case 'AirQualityIntent': {
        const { lat, lon } = await getLatLon(city);
        const airRes = await axios.get(
          `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        const aqiValue = airRes.data.list[0].main.aqi;
        const aqiLevels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];

        return res.status(200).json({
          fulfillmentText: `The air quality in ${city} is ${aqiLevels[aqiValue - 1]} (AQI level ${aqiValue}).`,
        });
      }

      case 'ClothingIntent': {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const temp = response.data.main.temp;

        let suggestion = '';
        if (temp < 10) suggestion = 'Wear a warm coat and gloves.';
        else if (temp < 20) suggestion = 'A jacket or sweater would be ideal.';
        else suggestion = 'It’s warm, wear light clothes!';

        return res.status(200).json({
          fulfillmentText: `It's ${temp}°C in ${city}. ${suggestion}`,
        });
      }

      default:
        return res.status(200).json({
          fulfillmentText: 'Sorry, I didn’t get that.',
        });
    }
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({
      fulfillmentText: 'Something went wrong while fetching weather data.',
    });
  }
}
