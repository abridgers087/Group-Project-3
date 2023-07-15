let weatherChart, atrChart, candlestickChart

// Load in initial data sets and build charts when dom is ready
document.addEventListener("DOMContentLoaded", function () {
  // Create the year dropdown menu
  const yearDropdown = document.getElementById("year-dropdown")
  const startYear = 2011
  const endYear = 2019
  for (let year = startYear; year <= endYear; year++) {
    const option = document.createElement("option")
    option.text = year
    yearDropdown.add(option)
  }

  //Set default year
  const defaultYear = startYear

  // Create the city dropdown menu
  const cityDropdown = document.getElementById("city-dropdown")
  const cities = [
    "Chicago",
    "New York City",
    "Los Angeles",
    "Detroit",
    "Columbus",
    "Philadelphia",
    "Newark",
    "Houston",
    "Indianapolis",
    "Milwaukee",
  ]

  cities.forEach((city) => {
    const option = document.createElement("option")
    option.text = city
    cityDropdown.add(option)
  })

  // Set default city
  const defaultCity = cities[0] // Set the first city as default
  document.getElementById("city-label").innerHTML = defaultCity
  // Construct the weather chart
  initWeatherChart(defaultYear, defaultCity)
  initiateFuturesChart(defaultYear)

  // Update the chart when the year or city is changed
  yearDropdown.addEventListener("change", function () {
    updateWeatherChart(yearDropdown.value, cityDropdown.value)
    updateFuturesCharts(yearDropdown.value)
  })
  cityDropdown.addEventListener("change", function () {
    updateWeatherChart(yearDropdown.value, cityDropdown.value)
    document.getElementById("city-label").innerHTML = cityDropdown.value
  })
})

// Configure and render futures Highcharts
async function initiateFuturesChart(year) {
  console.log("initiateFuturesChart")
  const futuresData = await loadFuturesData(year)

  const atrChartOptions = {
    chart: {
      renderTo: "ATRchart",
    },
    title: {
      text: "5 Day Average True Range (ATR) of Natural Gas Futures",
      align: "center",
    },

    subtitle: {
      text: "",
      align: "left",
    },
    yAxis: {
      title: {
        text: "ATR",
      },
      lineWidth: 1,
    },

    xAxis: {
      type: "datetime",
      labels: {
        format: "{value:%e-%b}",
      },
      events: {
        setExtremes: syncExtremes, // Call syncExtremes function on setExtremes event
      },

      min: futuresData.atr[0].date, // Set the min value of the xAxis to the first timestamp
    },

    legend: {
      enabled: false,
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
        pointStart: 2011,
      },
    },
    series: [
      {
        name: "Natural Gas Futures ATR",
        data: futuresData.atr,
        dataGrouping: {
          units: [
            [
              "day", // unit name
              [1], // allowed multiples
            ],
          ],
        },
      },
    ],

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
            },
          },
        },
      ],
    },
  }

  atrChart = new Highcharts.Chart(atrChartOptions)

  const candleStickChartOptions = {
    chart: {
      renderTo: "priceChart",
    },
    rangeSelector: {
      enabled: false,
    },

    xAxis: {
      type: "datetime",
      events: {
        setExtremes: syncExtremes, // Call syncExtremes function on setExtremes event
      },
      min: futuresData.candlestick[0].date, // Set the min value of the xAxis to the first timestamp
    },

    yAxis: {
      lineWidth: 1,
      opposite: false,

      title: {
        text: "Price",
      },
    },

    title: {
      text: "Henry Hub Natural Gas Futures Price per 1 Million British Thermal Units (ticker: NG=F)",
    },

    series: [
      {
        type: "candlestick",
        name: "Natural gas futures",
        data: futuresData.candlestick,
        dataGrouping: {
          units: [
            [
              "day", // unit name
              [1], // allowed multiples
            ],
          ],
        },
      },
    ],
  }

  candlestickChart = new Highcharts.Chart(candleStickChartOptions)
}

// Conigure and render the weather chart loading in data with the default year and city
async function initWeatherChart(year, city) {
  // Retrieve data for initial chart load
  weatherData = await loadWeatherData(year, city)
  console.log(weatherData)
  // Determine the start and end dates for the winter season
  const chartStartDate = new Date(`${year}-12-01`)
  const chartEndDate = new Date(year + 1, 2, 0) // Set the end date to the last day of February

  const utcChartStartDate = Date.UTC(
    chartStartDate.getUTCFullYear(),
    chartStartDate.getUTCMonth(),
    chartStartDate.getUTCDate()
  )

  const numberOfDays = Math.round(
    (chartEndDate - chartStartDate) / (24 * 60 * 60 * 1000)
  )

  const weatherChartOptions = {
    chart: {
      renderTo: "temperatureChart",
    },
    title: {
      text: "",
      align: "center",
    },
    xAxis: {
      type: "datetime",
      accessibility: {
        rangeDescription: `Range: ${chartStartDate.toDateString()} to ${chartEndDate.toDateString()}`,
      },
      events: {
        setExtremes: syncExtremes, // Call syncExtremes function on setExtremes event
      },

      //   min: utcStartDate, // Set the minimum value of the x-axis to the start date
      //   max: endDate.getTime(), // Set the maximum value of the x-axis to the end date
      //   tickInterval: 30 * 24 * 60 * 60 * 1000, // Display ticks at monthly intervals
      labels: {
        format: "{value:%e-%b}", // Format tick labels as abbreviated month names
      },
    },
    yAxis: {
      title: {
        text: "Temperature (°F)",
      },
      min: null,
    },
    tooltip: {
      crosshairs: true,
      shared: true,
      valueSuffix: "°F",
      valueDecimals: 2, // Set the number of decimal places for the temperature values
    },
    plotOptions: {
      series: {
        pointStart: utcChartStartDate,
        pointEnd: chartEndDate.getTime() + numberOfDays * (24 * 60 * 60 * 1000),
        pointIntervalUnit: "day",
        states: {
          hover: {
            enabled: true,
            halo: false, //disable halo effect
          },
        },
        reversedStacks: false, //disable reversed stacks
      },
    },
    series: [
      {
        name: "Temperature",
        data: weatherData.averages,
        zIndex: 1,
        marker: {
          fillColor: "white",
          lineWidth: 2,
          lineColor: Highcharts.getOptions().colors[0],
        },
      },
      {
        name: "Range",
        data: weatherData.ranges,
        type: "arearange",
        lineWidth: 0,
        linkedTo: ":previous",
        color: Highcharts.getOptions().colors[0],
        fillOpacity: 0.3,
        zIndex: 0,
        marker: {
          enabled: false,
        },
      },
    ],
  }

  weatherChart = new Highcharts.Chart(weatherChartOptions)
}

// Make API call to get fresh data and then refresh the weather chart
async function updateWeatherChart(year, city) {
  weatherData = await loadWeatherData(year, city)
  weatherChart.series[0].update({ data: weatherData.averages })
  weatherChart.series[1].update({ data: weatherData.ranges })
  weatherChart.redraw()
}

// Make API call to get fresh data and then refresh the futures charts
async function updateFuturesCharts(year) {
  futuresData = await loadFuturesData(year)
  atrChart.series[0].update({ data: futuresData.atr })
  atrChart.redraw()
  candlestickChart.series[0].update({ data: futuresData.candlestick })
  candlestickChart.redraw()
}

// Load weather data from the API and return it formatted ready for Highcharts
async function loadWeatherData(year, city) {
  const cityURL = `http://127.0.0.1:5000/${year}/weather_data/${city}`
  const response = await fetch(cityURL)
  const data = await response.json()
  return formatWeatherData(data, year, city)
}

// Load futures data from the API and return it formatted ready for Highcharts
async function loadFuturesData(year) {
  const futuresURL = `http://127.0.0.1:5000/${year}/futures_data`
  const response = await fetch(futuresURL)
  const data = await response.json()

  const atr = data.map(function (row) {
    return [new Date(row.Date).getTime(), row.ATR]
  })

  // map price data into properly formatted array and convert datetime to unix
  const candlestick = data.map(function (row) {
    return [
      new Date(row.Date).getTime(),
      row.Open,
      row.High,
      row.Low,
      row.Adj_Close,
    ]
  })

  return {
    atr: atr,
    candlestick: candlestick,
  }
}

// Format the returned weather data from the API for consumption by Highcharts
function formatWeatherData(cityData, year, city) {
  // Determine the start and end dates for the winter season
  const startDate = new Date(`${year}-12-01`)
  const utcStartDate = Date.UTC(
    startDate.getUTCFullYear(),
    startDate.getUTCMonth(),
    startDate.getUTCDate()
  )

  const endDate = new Date(year + 1, 2, 0) // Set the end date to the last day of February

  const filteredData = cityData.filter((record) => {
    const recordDate = new Date(record.date)
    return recordDate >= startDate && recordDate <= endDate
  })

  const ranges = filteredData.map((record) => [
    record.tmin !== null ? record.tmin : undefined,
    record.tmax !== null ? record.tmax : undefined,
  ])

  const averages = filteredData.map((record) => record.tavg)

  const data = {
    ranges: ranges,
    averages: averages,
  }
  return data
}

// Synchronize the extremes of the xAxis
function syncExtremes(e) {
  let chart = this.chart

  if (e.trigger !== "syncExtremes") {
    // Prevent feedback loop
    // Loop through each chart and set the extremes
    Highcharts.each(Highcharts.charts, function (ch) {
      if (ch !== chart) {
        if (ch.xAxis[0].setExtremes) {
          ch.xAxis[0].setExtremes(e.min, e.max, undefined, false, {
            trigger: "syncExtremes",
          })
        }
      }
    })
  }
}
