const express = require("express");

const bodyParser = require("body-parser");

const request = require("request");

const app = express();

require("dotenv").config();

const apiKey = `${process.env.API_KEY}`;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("index", { weather: null, error: null });
});

app.post("/", function (req, res) {
  let city = req.body.city;

  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  request(url, function (err, response, body) {
    if (err) {
      res.render("index", { weather: null, error: "Error, please try again" });
    } else {
      let weather = JSON.parse(body);

      console.log(weather);

      if (weather.main == undefined) {
        res.render("index", {
          weather: null,

          error: "Error, please try again",
        });
      } else {
        // we shall use the data got to set up your output

        let place = `${weather.name}, ${weather.sys.country}`,
          /* you shall calculate the current timezone using the data fetched*/

          weatherTimezone = `${new Date(
            weather.dt * 1000 - weather.timezone * 1000
          )}`;

        let weatherTemp = `${weather.main.temp}`,
          weatherPressure = `${weather.main.pressure}`,
          /* you will fetch the weather icon and its size using the icon data*/

          weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
          weatherDescription = `${weather.weather[0].description}`,
          humidity = `${weather.main.humidity}`,
          clouds = `${weather.clouds.all}`,
          visibility = `${weather.visibility}`,
          main = `${weather.weather[0].main}`,
          weatherFahrenheit;

        weatherFahrenheit = (weatherTemp * 9) / 5 + 32;

        // you shall also round off the value of the degrees fahrenheit calculated into two decimal places

        function roundToTwo(num) {
          return +(Math.round(num + "e+2") + "e-2");
        }

        weatherFahrenheit = roundToTwo(weatherFahrenheit);

        // you shall now render the data to your page (index.ejs) before displaying it out

        res.render("index", {
          weather: weather,

          place: place,

          temp: weatherTemp,

          pressure: weatherPressure,

          icon: weatherIcon,

          description: weatherDescription,

          timezone: weatherTimezone,

          humidity: humidity,

          fahrenheit: weatherFahrenheit,

          clouds: clouds,

          visibility: visibility,

          main: main,

          error: null,
        });
      }
    }
  });
});

app.listen(5000, function () {
  console.log("Weather app listening on port 5000!");
});
