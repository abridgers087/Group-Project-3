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
      //console.log(`${city} weather: `, data)
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
  ];

  winterData.forEach(({ year, variableName, winterNumber }) => {
    const url = `http://127.0.0.1:5000/futures_data/Winter${winterNumber}`
    d3.json(url).then(function (data) {
      //console.log(`Winter ${year}: `, data)
      window[variableName] = data
    })
    // Append the city as an option to the select element
    d3.select("#year").append("option").attr("value", year).text(year)
  });
  

  /////////////////////////////////////////////////////////////////////////////////////////
  // include these lines in HTML script

  //   <script src="https://code.highcharts.com/stock/highstock.js"></script>
  //   <script src="https://code.highcharts.com/stock/modules/exporting.js"></script>
  //   <script src="https://code.highcharts.com/stock/modules/accessibility.js"></script>

  /////////////////////////////////////////////////////////////////////////////////////////

// function to initialize webpage with 2011-2012 price data
function init() {

    candleStick(winter_11_12)

};

function candleStick (dataset) {
    console.log('Selected Dataset: ',dataset);

    // map price data into properly formatted array and convert datetime to unix
    let data = dataset.map(function(row){
        return [new Date(row.Date).getTime() , row.Open, row.High, row.Low, row.Adj_Close]
    })

    console.log("Here's the mapped data :", data)


    // create candlestick plot
    Highcharts.stockChart('container', {
        // turn off zoom function
        rangeSelector: {
            enabled: false
        },

        title: {
            text: 'Natural Gas Futures (ticker: NG=F)'
        },

        series: [{
            type: 'candlestick',
            name: 'Natural gas futures',
            data: data,
            dataGrouping: {
                units: [
                    [
                        'day', // unit name
                        [1] // allowed multiples
                    ], 
                ]
            }
        }]
    });
};

// update plot based on year selected in dropdown
// not working properly
function updatePlot() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#year");

    // Assign the value of the dropdown menu option to a variable
    let selected_year = dropdownMenu.property("value")

    // finds price data for year selected
    // code below not working properly
    if (selected_year ==='2012-2013') {
        var data = winter_12_13
    };

    // clears previous graph
    d3.select("#container").html("")

    console.log(data)

    candleStick(data)



};

setTimeout(function() {

    

    init();

    // breaks when run with commented out code above
    // not able to read in dataset properly in updatePlot function
    //d3.selectAll("#year").on("change", updatePlot());

}, 5000);
