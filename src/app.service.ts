import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import axios from 'axios';
import {
  geoUrl,
  weather_url,
  convert_temperature_to_celsius_from_kelvin,
  ip_info_url,
} from './dto/requestResponse';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}
  async getHello(visitor_name: string): Promise<object> {
    const gotten_location = await axios.get(
      ip_info_url + process.env.ipinfo_key,
    );
    console.log(gotten_location.data);
    const location: string = gotten_location.data.city;
    const temp = (await this.get_location_temperature(location)).data.main;
    const cel_temp = convert_temperature_to_celsius_from_kelvin(+temp.temp);
    return {
      client_ip: gotten_location.data.ip,
      location: location,
      greeting: generate_greeting(visitor_name, cel_temp, location),
    };
  }

  private get_location = () => {
    const data = axios.get(geoUrl + process.env.geo_api_key);
    return data;
  };

  private get_location_temperature = (location: string) => {
    const request_made = this.httpService.get(weather_url(location));
    return lastValueFrom(request_made);
  };
}

const generate_greeting = (
  name: string,
  temp: string,
  location: string,
): string => {
  return `Hello, ${name}!, the temperature is ${temp} degrees Celcius in ${location}`;
};
