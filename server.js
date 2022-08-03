// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Express to run server and routes
import express from "express";

// Start up an instance of app
const app = express();

/* Dependencies */
import bodyParser from "body-parser";
const { urlencoded, json } = bodyParser;

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(urlencoded({ extended: false }));
app.use(json());

// Cors for cross origin allowance
import cors from "cors";
app.use(cors());

/* Initializing the main project folder */
app.use(express.static("website"));

// Setup Server
const port = 8000;

function listening() {
  console.log(`running on localhost: ${port}`);
}

app.listen(port, listening);

// Respond with JS object when a GET request is made to get the recent weather entry
app.get("/getRecentWeatherEntry", function (req, res) {
  res.send(projectData);
});

// Listen to a POST request is made to add a weather entry
app.post("/addWeatherEntry", async function (req, res) {
  Object.assign(projectData, req.body)
  res.send({
    message: "The weather entry added succesfuly.",
  });
});
