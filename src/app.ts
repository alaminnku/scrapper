import express from "express";
import CBDJewellers from "./routes/cbdJewellers";
import scrapeCBDJewellers from "./scrapper/cbdJewellers";

// Create port
const PORT = process.env.PORT || 5300;

// Initiate app
const app = express();

// Middleware
app.use(express.json());

scrapeCBDJewellers();

app.get("/", CBDJewellers);

app.listen(PORT, () => console.log("Server started"));
