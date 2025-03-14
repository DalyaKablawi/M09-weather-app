import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

class Weather {
  constructor(
    public city: string,
    public currentTemperature: number,
    public humidity: number,
    public windSpeed: number,
    public description: string,
    public forecast: Array<any>
  ) {}
}

class WeatherService {
  private baseURL = "https://api.openweathermap.org/data/2.5/";
  private apiKey = process.env.OPENWEATHER_API_KEY;

  private async fetchLocationData(query: string) {
    const response = await axios.get(`${this.baseURL}geo/1.0/direct`, {
      params: {
        q: query,
        limit: 1,
        appid: this.apiKey,
      },
    });
    return response.data;
  }

  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData[0].lat,
      lon: locationData[0].lon,
    };
  }

  private buildGeocodeQuery(query: string): string {
    return `${this.baseURL}geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }

  private async fetchAndDestructureLocationData(
    query: string
  ): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(query);

    if (!locationData || locationData.length === 0) {
      throw new Error("Location not found");
    }

    return this.destructureLocationData(locationData);
  }

  private async fetchWeatherData(coordinates: Coordinates) {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await axios.get(weatherQuery);
    return response.data;
  }

  private parseCurrentWeather(response: any) {
    return {
      currentTemperature: response.main.temp,
      humidity: response.main.humidity,
      windSpeed: response.wind.speed,
      description: response.weather[0].description,
    };
  }

  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    return weatherData.slice(1, 6).map((data) => ({
      date: new Date(data.dt * 1000).toLocaleDateString(),
      temperature: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
    }));
  }

  public async getWeatherForCity(city: string): Promise<Weather> {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);

    const currentWeather = this.parseCurrentWeather(weatherData);

    const forecastData = await axios.get(
      `${this.baseURL}forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`
    );

    const forecastArray = this.buildForecastArray(
      currentWeather,
      forecastData.data.list
    );

    return new Weather(
      city,
      currentWeather.currentTemperature,
      currentWeather.humidity,
      currentWeather.windSpeed,
      currentWeather.description,
      forecastArray
    );
  }
}
export default new WeatherService();
