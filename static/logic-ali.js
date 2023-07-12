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

  // Function to update the chart based on the selected year and city
  function updateChart(year, city) {
    console.log("Updating chart for year:", year, "and city:", city)

    const cityURL = `http://127.0.0.1:5000/weather_data/${city}/${year}`

    // Use fetch to load the city data
    fetch(cityURL)
      .then((response) => response.json())
      .then(function (cityData) {
        console.log("Received data for city:", city, "data:", cityData)

        // Filter data for the selected year
        const filteredData = cityData.filter((record) => {
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
        const endDate = new Date(year, 2, 0) // Set the end date to the last day of February

        // Calculate the number of days in the winter season
        const numberOfDays = Math.round(
          (endDate - startDate) / (24 * 60 * 60 * 1000)
        )
        console.log("Number o days: ", numberOfDays)
        console.log("Start Date:", startDate.toDateString())
        console.log("End Date:", endDate.toDateString())
        console.log("Number of Days:", numberOfDays)

        // Load the necessary Highcharts modules
        Highcharts.chartLoadCallback = function () {
          Highcharts.chart("container", {
            title: {
              text: `Winter ${year} Temperatures in ${city}`,
              align: "left",
            },
            xAxis: {
              type: "datetime",
              accessibility: {
                rangeDescription: `Range: ${startDate.toDateString()} to ${endDate.toDateString()}`,
              },
              min: startDate.getTime(), // Set the minimum value of the x-axis to the start date
              max: endDate.getTime(), // Set the maximum value of the x-axis to the end date
              tickInterval: 30 * 24 * 60 * 60 * 1000, // Display ticks at monthly intervals
              labels: {
                format: "{value:%b}", // Format tick labels as abbreviated month names
              },
            },
            yAxis: {
              title: {
                text: "Temperature (°F)",
              },
              min: null, // Remove the issue with negative temps
            },
            tooltip: {
              crosshairs: true,
              shared: true,
              valueSuffix: "°F",
              valueDecimals: 2, // Set the number of decimal places for the temperature values
            },
            plotOptions: {
              series: {
                pointStart: startDate.getTime(),
                pointEnd: endDate.getTime(), //+ numberOfDays * (24 * 60 * 60 * 1000),
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
        console.log("Error loading data for city:", city, "error:", error)
      })
  }

  // Update the chart with default year and city
  updateChart(defaultYear, defaultCity)

  // Event listener for dropdown change
  function handleDropdownChange() {
    const selectedYear = parseInt(yearDropdown.value)
    const selectedCity = cityDropdown.value
    updateChart(selectedYear, selectedCity)
  }

  yearDropdown.addEventListener("change", handleDropdownChange)
  cityDropdown.addEventListener("change", handleDropdownChange)
})
