import express from "express";
import scrapeCBDJewellers from "./scrapper/cbdJewellers";
import CBDJewellers from "./routes/cbdJewellers";

// Create port
const PORT = process.env.PORT || 5300;

// Initiate app
const app = express();

// Middleware
app.use(express.json());

scrapeCBDJewellers();

app.get("/", CBDJewellers);

app.listen(PORT, () => console.log("Server started"));
