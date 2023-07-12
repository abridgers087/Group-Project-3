///// CITY DATA /////

const cities = [
  "Los Angeles",
  "New York City",
  "Chicago",
  "Detroit",
  "Columbus",
  "Philadelphia",
  "Newark",
  "Houston",
  "Indianapolis",
  "Milwaukee",
]
const baseUrl = "http://127.0.0.1:5000/weather_data/"
cities.forEach((city) => {
  const url = baseUrl + encodeURIComponent(city)
  d3.json(url).then((data) => {
    console.log(`${city} weather: `, data)
    window[city.replace(" ", "")] = data
  })
  // Append the city as an option to the select element
  d3.select("#city").append("option").attr("value", city).text(city)
})

///// FUTURES DATA /////
const winterData = [
  { year: "2011-2012", variableName: "winter_11_12", winterNumber: 1 },
  { year: "2012-2013", variableName: "winter_12_13", winterNumber: 2 },
  { year: "2013-2014", variableName: "winter_13_14", winterNumber: 3 },
  { year: "2014-2015", variableName: "winter_14_15", winterNumber: 4 },
  { year: "2015-2016", variableName: "winter_15_16", winterNumber: 5 },
  { year: "2016-2017", variableName: "winter_16_17", winterNumber: 6 },
  { year: "2017-2018", variableName: "winter_17_18", winterNumber: 7 },
  { year: "2018-2019", variableName: "winter_18_19", winterNumber: 8 },
  { year: "2019-2020", variableName: "winter_19_20", winterNumber: 9 },
]
winterData.forEach(({ year, variableName, winterNumber }) => {
  const url = `http://127.0.0.1:5000/futures_data/Winter${winterNumber}`
  d3.json(url).then(function (data) {
    console.log(`Winter ${year}: `, data)
    window[variableName] = data
  })
  // Append the city as an option to the select element
  d3.select("#year").append("option").attr("value", year).text(year)
})

///////////////////////////////////

setTimeout(function() {
  console.log('chicago log', Chicago);
}, 5000);


  
  