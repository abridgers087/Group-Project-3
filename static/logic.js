//Test weather data flask API call
const url = " http://127.0.0.1:5000/weather_data/Newark"
d3.json(url).then(function (data) {
  console.log("weather json", data)
})
