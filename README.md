# Group-Project-3
Repo for Project 3 WUSTL Data Class


# Temperature vs Natural Gas Volatility for US Cities 
For this project, our group analyzed how the volatility of the natural gas futures market correlates with temperature in the top 10 residential consumption cities in the US. 

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Installing](#installing)
- [Usage](#usage)
- [Contributing](#contributing)

## About
For this project, our group analyzed how the volatility of the natural gas futures market correlates with temperature in the top 10 residential consumption cities in the US. 
We used ATR (average true range) as our volatility indicator. The true range indicator is taken as the greatest of the following: current high less the current low; the absolute value of the current high less the previous close; and the absolute value of the current low less the previous close. The ATR is then a moving average, generally using 14 days, of the true ranges. The cities in which we will be analyzing are based on the natural gas consumption by residential end users from the US Energy Information Administration. The natural gas futures ticker used is NG=F. We pull historical temperature data using the Meteostat API and natural gas prices using the Yahoo Finance API. 
In our dashboard, we have included a temperature chart which uses an arearange series in combination with a line series, futures price chart which uses a candlestick chart, and a futures ATR chart which uses a basic line chart.  In our case, the temperature chart arearange series is used to visualize the high to low temperature range per day, while the line series shows the average temperature per day, the futures price candlestick chart shows the futures open, high, low, and close prices per day, and the ATR basic line chart shows the ATR per day. Specifically, we have focused on Winter (December-February) because of the temperature extremes during those periods from 2011 to 2020. 

## Getting Started
1. Activate conda PythonData
2. Clone the git respositiory to your local repositary. 
3. Ensure the weather and futures JSON data is in your local repository "data" folder. If it is not, run the Natural Gas Futures and ATR jupyter notebook for the futures JSONs and the WeatherCode jupyter notebook for the weather JSONs. If the Natural Gas Futures and ATR jupyter notebook is ran, the yahoo finance api will need to be downloaded - see installation instructions. If the WeatherCode jupyter notebook is ran, an API key will need to be entered into api_keys - see installation instructions.
3. Run the Import for JSON Data to connect the MongoDB client to the JSON data.
4. Run the Flask.py app.
5. Run the index html. 

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Installing
1. Downloading yahoo finance API - see https://pypi.org/project/yfinance/ for instructions
2. Setting up Meteostat API key - see https://dev.meteostat.net/api/ to setup RapidAPI account. Once account is setup, go to https://rapidapi.com/meteostat/api/meteostat/ and retrieve API key under Header Parameters X-RapidAPI-Key, set rapid_api_key to API key in api_keys.py.

## Usage
1. Load index HTML.
2. Use the price drop down menu to select different winter price and ATR datasets.
3. Use the city drop down menu to select different city temperature datsets.

## Contributing
Ali Bridgers, Ed Shanks, Hannah Weber

## Resources
Meteostat API - https://rapidapi.com/meteostat/api/meteostat/ , used to collect historical temperature data
Yahoo Finance API - https://pypi.org/project/yfinance/ , used to collect natural gas futures data
US Energy Information Administration Natural Gas Consumption by End User - https://www.eia.gov/dnav/ng/ng_cons_sum_a_EPG0_vgt_mmcf_a.htm , used to identify the top 10 consuming cities in the US
HighCharts Demo Area Range and Lines - https://www.highcharts.com/demo/highcharts/arearange-line , used to chart the temperature data
HighCharts Demo Basic Line - https://www.highcharts.com/demo/highcharts/line-basic , used to chart the ATR data
HighCharts Demo Candlestick - https://www.highcharts.com/demo/stock/candlestick , used to chart the price data 
