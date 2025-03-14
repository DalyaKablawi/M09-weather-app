import fs from 'fs';
import path from "node:path";

class City {
  constructor(public id: string, public name: string) {}
}

class HistoryService {
  private filePath = path.join(__dirname, "searchHistory.json");

  private async read(): Promise<City[]> {
    try {
      const data = await fs.promises.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  private async write(cities: City[]): Promise<void> {
    try {
      await fs.promises.writeFile(
        this.filePath,
        JSON.stringify(cities, null, 2),
        "utf-8"
      );
    } catch (error) {
      console.error("Error writing to file", error);
    }
  }

  public async getCities(): Promise<City[]> {
    return this.read();
  }

  public async addCity(cityName: string): Promise<void> {
    const cities = await this.read();
    const id = new Date().toISOString();
    const newCity = new City(id, cityName);
    cities.push(newCity);
    await this.write(cities);
  }
}

export default new HistoryService();
