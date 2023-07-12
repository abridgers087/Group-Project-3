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

    /*
  The purpose of this demo is to demonstrate how multiple charts on the same page
  can be linked through DOM and Highcharts events and API methods. It takes a
  standard Highcharts config with a small variation for each data set, and a
  mouse/touch event handler to bind the charts together.
  */


  /**
   * In order to synchronize tooltips and crosshairs, override the
   * built-in events with handlers defined on the parent element.
   */
  ['mousemove', 'touchmove', 'touchstart'].forEach(function (eventType) {
    document.getElementById('container').addEventListener(
        eventType,
        function (e) {
            let chart,
                point,
                i,
                event;

            for (i = 0; i < Highcharts.charts.length; i = i + 1) {
                chart = Highcharts.charts[i];
                // Find coordinates within the chart
                event = chart.pointer.normalize(e);
                // Get the hovered point
                point = chart.series[0].searchPoint(event, true);

                if (point) {
                    point.highlight(e);
                }
            }
        }
    );
  });

  /**
  * Override the reset function, we don't need to hide the tooltips and
  * crosshairs.
  */
  Highcharts.Pointer.prototype.reset = function () {
    return undefined;
  };

  /**
  * Highlight a point by showing tooltip, setting hover state and draw crosshair
  */
  Highcharts.Point.prototype.highlight = function (event) {
    event = this.series.chart.pointer.normalize(event);
    this.onMouseOver(); // Show the hover marker
    this.series.chart.tooltip.refresh(this); // Show the tooltip
    this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
  };

  /**
  * Synchronize zooming through the setExtremes event handler.
  */
  function syncExtremes(e) {
    const thisChart = this.chart;

    if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
        Highcharts.each(Highcharts.charts, function (chart) {
            if (chart !== thisChart) {
                if (chart.xAxis[0].setExtremes) { // It is null while updating
                    chart.xAxis[0].setExtremes(
                        e.min,
                        e.max,
                        undefined,
                        false,
                        { trigger: 'syncExtremes' }
                    );
                }
            }
        });
    }
  }

  // Get the data. The contents of the data file can be viewed at
  Highcharts.ajax({
    url: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/activity.json',
    dataType: 'text',
    success: function (activity) {

        activity = JSON.parse(activity);
        console.log(activity);
        activity.datasets.forEach(function (dataset, i) {

            // Add X values
            dataset.data = Highcharts.map(dataset.data, function (val, j) {
                return [activity.xData[j], val];
            });

            const chartDiv = document.createElement('div');
            chartDiv.className = 'chart';
            document.getElementById('container').appendChild(chartDiv);

            Highcharts.chart(chartDiv, {
                chart: {
                    marginLeft: 40, // Keep all charts left aligned
                    spacingTop: 20,
                    spacingBottom: 20
                },
                title: {
                    text: dataset.name,
                    align: 'left',
                    margin: 0,
                    x: 30
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                xAxis: {
                    crosshair: true,
                    events: {
                        setExtremes: syncExtremes
                    },
                    labels: {
                        format: '{value} km'
                    },
                    accessibility: {
                        description: 'Kilometers',
                        rangeDescription: '0km to 6.5km'
                    }
                },
                yAxis: {
                    title: {
                        text: null
                    }
                },
                tooltip: {
                    positioner: function () {
                        return {
                            // right aligned
                            x: this.chart.chartWidth - this.label.width,
                            y: 10 // align to title
                        };
                    },
                    borderWidth: 0,
                    backgroundColor: 'none',
                    pointFormat: '{point.y}',
                    headerFormat: '',
                    shadow: false,
                    style: {
                        fontSize: '18px'
                    },
                    valueDecimals: dataset.valueDecimals
                },
                series: [{
                    data: dataset.data,
                    name: dataset.name,
                    type: dataset.type,
                    color: Highcharts.getOptions().colors[i],
                    fillOpacity: 0.3,
                    tooltip: {
                        valueSuffix: ' ' + dataset.unit
                    }
                }]
            });
        });
    }
  });




}, 5000);


  
  