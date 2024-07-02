export const geoUrl: string = 'https://geo.ipify.org/api/v2/country?apiKey=';

export const weather_url = (location: string): string =>
  `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.weather_key}`;

export const ip_info_url = 'https://ipinfo.io/105.112.29.0?token=';

export const convert_temperature_to_celsius_from_kelvin = (
  temp_value: number,
): string => (temp_value - 273.15).toFixed(2);
