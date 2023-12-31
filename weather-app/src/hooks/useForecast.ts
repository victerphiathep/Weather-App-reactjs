import { useState, useEffect, ChangeEvent } from "react";
import { optionType, forecastType } from "../types";

const useForecast = () => {
  // API Key
  const WEATHER_APP_API_KEY: string = "d900013bf0ee0780570601cb2da28e46";
  // Search Input Terms
  const [term, setTerm] = useState<string>("");
  // Dropdown box options
  const [options, setOptions] = useState<[]>([]);
  // Clear and Store drowndown box data
  const [city, setCity] = useState<optionType | null>(null);
  // Clicking drop down menu options and grabbing data
  const [weather, weatherData] = useState<forecastType | null>(null);

  const [isShaking, setIsShaking] = useState(false); // State to control shaking animation
  // Using input information for Geocoding API to find location
  // Geocoding API
  const getSearchOptions = (value: string) => {
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${WEATHER_APP_API_KEY}`
    )
      // Grabs data using .then()

      .then((res) => res.json())
      .then((data) => setOptions(data));
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Display inputted text on input box
    setTerm(value);

    if (value === "") return;

    getSearchOptions(value);
  };

  const onOptionSelect = (option: optionType) => {
    setCity(option);
  };

  // Grab weather data after submitting
  const getWeatherData = (city: optionType) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&units=imperial&appid=${WEATHER_APP_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        const forecastData = {
          ...data.city,
          list: data.list.slice(0, 16),
        };
        weatherData(forecastData)
      }).catch(e => console.log(e))
  };

  const onSubmit = () => {
    if (!city) {
      setIsShaking(true); // Activate the shake animation
      setTimeout(() => {
        setIsShaking(false); // Turn off the shake animation after a delay
      }, 1000);
      return;
    }

    getWeatherData(city);
  };

  // Empty our setOptions drop down after clicking which city we want
  useEffect(() => {
    if (city) {
      setTerm(`${city.name}, ${city.state} ${city.country}`);
      setOptions([]);
    }
  }, [city]);

  return {
    term,
    options,
    weather,
    onInputChange,
    onOptionSelect,
    onSubmit,
    isShaking,
  };
};

export default useForecast;