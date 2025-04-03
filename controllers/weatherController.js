import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_URL = process.env.WEATHER_API_URL;

/**
 * Fetches weather data for a given location.
 * @param {string} location 
 * @returns {Object|null}
 */
export const fetchWeather = async (location) => {
    try {
        const response = await axios.get(WEATHER_API_URL, {
            params: {
                q: location,
                appid: WEATHER_API_KEY,
                units: "imperial"
            }
        });

        const data = response.data;
        return {
            condition: data.weather[0].description,
            temperature: data.main.temp,
            location: `${data.name}, ${data.sys.country}`
        };
    } catch (error) {
        console.error("Error fetching weather data:");
        return null;
    }
};
