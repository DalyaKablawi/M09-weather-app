import { Router, type Request, type Response } from "express";
import HistoryService from "../../service/historyService.js";
import WeatherService from "../../service/weatherService.js";
const router = Router();

// import HistoryService from '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post("/", async (req: Request, res: Response) => {
  try {
    const weatherData = await WeatherService.getWeather(cityName);

    await HistoryService.addCityToHistory(cityName);

    res.status(200).json(weatherData);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving weather data",
      error: error.message,
    });
  }
});

// TODO: GET search history
router.get("/history", async (req: Request, res: Response) => {
  try {
    const history = await HistoryService.getSearchHistory();
    res.status(200).json(history);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving search history",
        error: error.message,
      });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete("/history/:id", async (req: Request, res: Response) => {});

export default router;
