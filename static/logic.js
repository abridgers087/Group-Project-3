// Data for natural gas price futures and temperature
// Replace with your own data or fetch from an API
var priceData = {
  "New York": {
    2019: [1.2, 1.5, 1.8, 2.0],
    2020: [1.3, 1.7, 2.1, 2.4],
    2021: [1.4, 1.9, 2.3, 2.7],
  },
  London: {
    2019: [0.9, 1.1, 1.3, 1.5],
    2020: [0.8, 1.0, 1.2, 1.4],
    2021: [0.7, 0.9, 1.1, 1.3],
  },
  Tokyo: {
    2019: [2.5, 2.8, 3.0, 3.2],
    2020: [2.6, 2.9, 3.1, 3.3],
    2021: [2.7, 3.0, 3.2, 3.5],
  },
}

var temperatureData = {
  "New York": {
    2019: [15, 18, 20, 22],
    2020: [16, 19, 21, 23],
    2021: [17, 20, 22, 24],
  },
  London: {
    2019: [10, 12, 14, 16],
    2020: [11, 13, 15, 17],
    2021: [12, 14, 16, 18],
  },
  Tokyo: {
    2019: [25, 28, 30, 32],
    2020: [26, 29, 31, 33],
    2021: [27, 30, 32, 35],
  },
}

// Function to update the charts based on the selected year and city
function updateCharts() {
  var selectedYear = document.getElementById("year").value
  var selectedCity = document.getElementById("city").value

  var priceTrace = {
    x: [1, 2, 3, 4], // Assuming 4 data points
    y: priceData[selectedCity][selectedYear],
    type: "scatter",
    name: "Natural Gas Price",
  }

  var temperatureTrace = {
    x: [1, 2, 3, 4], // Assuming 4 data points
    y: temperatureData[selectedCity][selectedYear],
    type: "scatter",
    name: "Temperature",
  }

  var priceLayout = {
    title: "Natural Gas Price",
    xaxis: { title: "Month" },
    yaxis: { title: "Price" },
  }

  var temperatureLayout = {
    title: "Temperature",
    xaxis: { title: "Month" },
    yaxis: { title: "Temperature" },
  }

  Plotly.newPlot("priceChart", [priceTrace], priceLayout)
  Plotly.newPlot("temperatureChart", [temperatureTrace], temperatureLayout)
}

// Add an event listener to the year and city selection drop-down boxes
document.getElementById("year").addEventListener("change", updateCharts)
document.getElementById("city").addEventListener("change", updateCharts)

// Initial chart display
updateCharts()
