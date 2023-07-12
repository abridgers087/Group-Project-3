document.addEventListener("DOMContentLoaded", function () {
  // Create the year dropdown menu
  const yearDropdown = document.getElementById("year-dropdown")
  const startYear = 2011
  const endYear = 2020
  for (let year = startYear; year <= endYear; year++) {
    const option = document.createElement("option")
    option.text = year
    yearDropdown.add(option)
  }

  // Set default year
  const defaultYear = startYear

  // Function to update the chart based on the selected year
  function updateChart(year) {
    const chicagoURL = "http://127.0.0.1:5000/weather_data/Chicago"

    // Use D3 to load the Chicago data
    d3.json(chicagoURL)
      .then(function (chicagoData) {
        // Filter data for the selected year
        const filteredData = chicagoData.filter((record) => {
          const recordYear = new Date(record.date).getFullYear()
          return recordYear === year
        })

        const ranges = filteredData.map((record) => [
          record.tmin !== null ? record.tmin : undefined,
          record.tmax !== null ? record.tmax : undefined,
        ])

        const averages = filteredData.map((record) => record.tavg)

        // Determine the start and end dates for the winter season
        const startDate = new Date(`${year - 1}-12-01`)
        const endDate = new Date(year, 2, 0)

        // Calculate the number of days in the winter season
        const numberOfDays = Math.round(
          (endDate - startDate) / (24 * 60 * 60 * 1000)
        )

        // Load the necessary Highcharts modules
        Highcharts.chartLoadCallback = function () {
          Highcharts.chart("container", {
            title: {
              text: `Winter ${year} Temperatures in Chicago`,
              align: "left",
            },
            xAxis: {
              type: "datetime",
              accessibility: {
                rangeDescription: `Range: ${startDate.toDateString()} to ${endDate.toDateString()}`,
              },
              min: startDate.getTime(), // Set the minimum value of the x-axis to the start date
              max: endDate.getTime(), // Set the maximum value of the x-axis to the end date
            },
            yAxis: {
              title: {
                text: "Temperature (°F)",
              },
            },
            tooltip: {
              crosshairs: true,
              shared: true,
              valueSuffix: "°F",
            },
            plotOptions: {
              series: {
                pointStart: startDate.getTime(),
                pointEnd:
                  startDate.getTime() + numberOfDays * (24 * 60 * 60 * 1000),
                pointIntervalUnit: "day",
              },
            },
            series: [
              {
                name: "Temperature",
                data: averages,
                zIndex: 1,
                marker: {
                  fillColor: "white",
                  lineWidth: 2,
                  lineColor: Highcharts.getOptions().colors[0],
                },
              },
              {
                name: "Range",
                data: ranges,
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
          })
        }

        // Load the necessary Highcharts modules
        Highcharts.chartLoadCallback()
      })
      .catch(function (error) {
        console.log("Error loading data:", error)
      })
  }

  // Update the chart with default year
  updateChart(defaultYear)

  // Event listener for year dropdown change
  yearDropdown.addEventListener("change", function () {
    const selectedYear = parseInt(yearDropdown.value)
    updateChart(selectedYear)
  })
})
