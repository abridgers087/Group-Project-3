// const cities = [
//     "Los Angeles",
//     "New York City",
//     "Chicago",
//     "Detroit",
//     "Columbus",
//     "Philadelphia",
//     "Newark",
//     "Houston",
//     "Indianapolis",
//     "Milwaukee",
//   ]
//   const baseUrl = "http://127.0.0.1:5000/weather_data/"
//   cities.forEach((city) => {
//     const url = baseUrl + encodeURIComponent(city)
//     d3.json(url).then((data) => {
//       //console.log(`${city} weather: `, data)
//       window[city.replace(" ", "")] = data
//     })
//     // Append the city as an option to the select element
//     d3.select("#city").append("option").attr("value", city).text(city)
//   })

let promises = []

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
  promises.push(
    d3.json(url).then(function (data) {
      //console.log(`Winter ${year}: `, data)
      window[variableName] = data
    })
  )
  // Append the city as an option to the select element
  d3.select("#year-dropdown")
    .append("option")
    .attr("value", variableName)
    .text(year)
})

/////////////////////////////////////////////////////////////////////////////////////////
// include these lines in HTML script

//   <script src="https://code.highcharts.com/stock/highstock.js"></script>
//   <script src="https://code.highcharts.com/stock/modules/exporting.js"></script>
//   <script src="https://code.highcharts.com/stock/modules/accessibility.js"></script>

/////////////////////////////////////////////////////////////////////////////////////////

// function to initialize webpage with 2011-2012 price data
function init() {
  candleStick(winter_11_12)
  ATRLine(winter_11_12)
  synch()
}

function synch() {
  // * In order to synchronize tooltips and crosshairs, override the
  // * built-in events with handlers defined on the parent element.
  //*/
  ;["mousemove", "touchmove", "touchstart"].forEach(function (eventType) {
    document
      .getElementById("col-md-5")
      .addEventListener(eventType, function (e) {
        let chart, point, i, event

        for (i = 0; i < Highcharts.charts.length; i = i + 1) {
          chart = Highcharts.charts[i]
          // Find coordinates within the chart
          event = chart.pointer.normalize(e) //throwing error in console upon selecting year dataset
          // Get the hovered point
          point = chart.series[0].searchPoint(event, true)

          if (point) {
            point.highlight(e)
          }
        }
      })
  })

  /**
   * Override the reset function, we don't need to hide the tooltips and
   * crosshairs.
   */
  Highcharts.Pointer.prototype.reset = function () {
    return undefined
  }

  /**
   * Highlight a point by showing tooltip, setting hover state and draw crosshair
   */
  Highcharts.Point.prototype.highlight = function (event) {
    event = this.series.chart.pointer.normalize(event)
    this.onMouseOver() // Show the hover marker
    this.series.chart.tooltip.refresh(this) // Show the tooltip
    this.series.chart.xAxis[0].drawCrosshair(event, this) // Show the crosshair
  }

  /**
   * Synchronize zooming through the setExtremes event handler.
   */
  function syncExtremes(e) {
    const thisChart = this.chart

    if (e.trigger !== "syncExtremes") {
      // Prevent feedback loop
      Highcharts.each(Highcharts.charts, function (chart) {
        if (chart !== thisChart) {
          if (chart.xAxis[0].setExtremes) {
            // It is null while updating
            chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, {
              trigger: "syncExtremes",
            })
          }
        }
      })
    }
  }
}

function ATRLine(dataset) {
  let data = dataset.map(function (row) {
    return [new Date(row.Date).getTime(), row.ATR]
  })

  console.log("Here's the mapped data :", data)

  // chart ATR data
  Highcharts.chart("ATRchart", {
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
      min: data[0][0], // Set the min value of the xAxis to the first timestamp
    },

    legend: {
      enabled: false,
      //layout: 'vertical',
      //align: 'right'
      //verticalAlign: 'middle'
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
        data: data,
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
  })
}

function candleStick(dataset) {
  console.log("Selected Dataset: ", dataset)

  // map price data into properly formatted array and convert datetime to unix
  let data = dataset.map(function (row) {
    return [
      new Date(row.Date).getTime(),
      row.Open,
      row.High,
      row.Low,
      row.Adj_Close,
    ]
  })

  console.log("Here's the mapped data :", data)

  // create candlestick plot
  Highcharts.stockChart("priceChart", {
    // turn off zoom function
    rangeSelector: {
      enabled: false,
    },

    xAxis: {
      type: "datetime",
      events: {
        setExtremes: syncExtremes, // Call syncExtremes function on setExtremes event
      },
      min: data[0][0], // Set the min value of the xAxis to the first timestamp
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
        data: data,
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
  })
}

// update plot based on year selected in dropdown
// not working properly
////////////////////////////////////////////////////////////////////////////////////////////////
function updatePlot() {
  let selectedWinter

  // Get the dropdown element
  let dropdown = document.getElementById("year-dropdown")

  // Add event listener to handle selection change
  dropdown.addEventListener("change", handleDropdownChange)

  // Event handler function for dropdown change
  function handleDropdownChange(event) {
    let selectedVariableName = event.target.value

    // Find the dataset in winterData based on the selected variableName
    let selectedDataset = winterData.find(
      (item) => item.variableName === selectedVariableName
    )

    // Check if a dataset is found
    if (selectedDataset) {
      // Access the desired dataset properties
      let year = selectedDataset.year
      let winterNumber = selectedDataset.winterNumber
      selectedWinter = selectedDataset.variableName

      // Use the selected dataset for further processing
      console.log("variableName:", selectedWinter)
      console.log("Year:", year)
      console.log("Winter Number:", winterNumber)

      //Plug into ATRdata
      //ATRdata(window[selectedWinter]);

      candleStick(window[selectedWinter])
      ATRLine(window[selectedWinter])
      synch()
    } else {
      console.log("Dataset not found for the selected variableName.")
    }
  }
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

Promise.all(promises).then(function () {
  d3.selectAll("#year-dropdown").on("change", updatePlot())
  init()
})
