import dotenv from "dotenv";
import express from "express";
import path from "node:path";
import routes from "./routes/api/index";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

const clientDistPath = path.join(__dirname, "dist");
app.use(express.static(clientDistPath));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
