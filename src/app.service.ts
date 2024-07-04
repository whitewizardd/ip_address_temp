// import { AppService } from './app.service';
// import { Injectable } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
// import { lastValueFrom } from 'rxjs';
// import axios from 'axios';
// import {
//   weather_url,
//   convert_temperature_to_celsius_from_kelvin,
//   ip_info_url,
//   geoUrl
// } from './dto/requestResponse';

// @Injectable()
// export class AppService {
//   constructor(private readonly httpService: HttpService) {}
//   async getHello(visitor_name: string): Promise<object> {
//     const gotten_location = await axios.get(
//       ip_info_url + process.env.ipinfo_key,
//     );
    
//     const locate = await axios.get(geoUrl + process.env.geo_api_key);

//     console.log(locate.data);

//     const location: string = gotten_location.data.region;
//     const temp = (await this.get_location_temperature(location)).data.main;
//     const cel_temp = convert_temperature_to_celsius_from_kelvin(+temp.temp);
//     return {
//       client_ip: gotten_location.data.ip,
//       location: location,
//       greeting: generate_greeting(visitor_name, cel_temp, location),
//     };
//   }

//   private get_location_temperature = (location: string) => {
//     const request_made = this.httpService.get(weather_url(location));
//     return lastValueFrom(request_made);
//   };
// }

const generate_greeting = (
  name: string,
  temp: string,
  location: string,
): string => {
  return `Hello, ${name}!, the temperature is ${temp} degrees Celcius in ${location}`;
};

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  async getLocationAndTemperature(visitor_name: string) {
    try {
      const ipInfoApiKey = this.configService.get<string>('IPINFO_API_KEY');
      const ipInfoResponse = await axios.get(
        `https://ipinfo.io?token=${ipInfoApiKey}`,
      );
      const { ip, city, region, country, loc } = ipInfoResponse.data;
      const [latitude, longitude] = loc.split(',');
      const openWeatherMapApiKey = this.configService.get<string>(
        'OPENWEATHERMAP_API_KEY',
      );
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${openWeatherMapApiKey}`,
      );
      const temperature = weatherResponse.data.main.temp;
      return {
        client_ip: ip,
        location: city,
        greeting: generate_greeting(visitor_name, temperature, city),
      };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get location and temperature data');
    }
  }
}
