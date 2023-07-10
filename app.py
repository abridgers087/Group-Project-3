# Import the dependencies.
# Weather dependencies
import requests
from api_keys import rapid_api_key
import json
import os
from flask import Flask, jsonify


#Natural Gas dependencies
import yfinance as yf
import pandas as pd

import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

import datetime as dt
from datetime import timedelta

from matplotlib import pyplot as plt

# Create an app, being sure to pass __name__
app = Flask(__name__)

# Gather the weather data and jsonify 
@app.route("/weather/jsonified")

def weather_data_route():

    #This function extracts temperature data for Dec-Feb from the dataset and converts it to Fahrenheit
    def extract_temperature_data(weather_data):
        temperature_data = []

        # Extract temperature data for December, January, and February
        for data_point in weather_data['data']:
            date = data_point['date']
            tavg_celsius = data_point['tavg']
            tmin_celsius = data_point['tmin']
            tmax_celsius = data_point['tmax']

            # Check if any temperature value is None
            if tavg_celsius is None or tmin_celsius is None or tmax_celsius is None:
                continue

            # Extract month from date
            month = int(date.split('-')[1])

            # Check if month is December, January, or February
            if month in [12, 1, 2]:
                # Convert Celsius to Fahrenheit and round to two decimal places
                tavg_fahrenheit = round((tavg_celsius * 9/5) + 32, 2)
                tmin_fahrenheit = round((tmin_celsius * 9/5) + 32, 2)
                tmax_fahrenheit = round((tmax_celsius * 9/5) + 32, 2)

                temperature_data.append({
                    'date': date,
                    'tavg_fahrenheit': tavg_fahrenheit,
                    'tmin_fahrenheit': tmin_fahrenheit,
                    'tmax_fahrenheit': tmax_fahrenheit
                })

        return temperature_data

    #This is the API function to pull down the weather data. Input Lat/lon of the requested city to get the weather data.
    #make sure to set up your api_keys file before running this function
    def get_weather_data(lat, lon):
        url = "https://meteostat.p.rapidapi.com/point/daily"

        querystring = {
            "lat": str(lat),
            "lon": str(lon),
            "start": "2011-01-01",
            "end": "2020-02-29",
            #"alt": "184"
        }

        headers = {
            "X-RapidAPI-Key": rapid_api_key,
            "X-RapidAPI-Host": "meteostat.p.rapidapi.com"
        }

        response = requests.get(url, headers=headers, params=querystring)

        weather_data = response.json()

        return weather_data

    #these function exports all the json data
    def export_data_to_json(data, filename):
        with open(filename, 'w') as file:
            json.dump(data, file)

    def export_datasets(datasets):
        data_folder = 'data'

        # Create 'data' folder if it doesn't exist
        if not os.path.exists(data_folder):
            os.makedirs(data_folder)

        for dataset_name, dataset in datasets.items():
            filename = os.path.join(data_folder, f"{dataset_name}_data.json")
            export_data_to_json(dataset, filename)

    #get data
    la = get_weather_data(34, 118)
    chi = get_weather_data(41, 87)
    detroit = get_weather_data(42, 83)
    milwaukee = get_weather_data(43, 87)
    nyc = get_weather_data(40, -73)
    columbus = get_weather_data(40, -83)
    philly = get_weather_data(39, -75)
    newark = get_weather_data(40, -74)
    houston = get_weather_data(29, -95)
    indianapolis = get_weather_data(39, -86)
    milwaukee = get_weather_data(43, -87)

    #extract data
    la_data = extract_temperature_data(la)
    nyc_data = extract_temperature_data(nyc)
    chi_data = extract_temperature_data(chi)
    detroit_data = extract_temperature_data(detroit)
    columbus_oh_data = extract_temperature_data(columbus)
    philly_data = extract_temperature_data(philly)
    newark_data = extract_temperature_data(newark)
    houston_data = extract_temperature_data(houston)
    indianapolis_data = extract_temperature_data(indianapolis)
    milwaukee_data = extract_temperature_data(milwaukee)

    # Dictionary to hold all datasets to export
    datasets = {
        'la': la_data,
        'nyc': nyc_data,
        'chi': chi_data,
        'detroit': detroit_data,
        'columbus_oh': columbus_oh_data,
        'philly': philly_data,
        'newark': newark_data,
        'houston': houston_data,
        'indianapolis': indianapolis_data,
        'milwaukee': milwaukee_data
    }

    export_datasets(datasets)
    
    return jsonify(datasets)

# Gather the weather data and jsonify 
@app.route("/naturalgas/jsonified")

def naturalgas_data():

    # parameters for API call
    start = start = dt.datetime(2011,12,1)
    end = dt.datetime(2020,2,29)
    ticker = 'NG=F' # 

    # API request
    df = yf.download(ticker,start,end)

    # rename adjusted close column
    df = df.rename(columns={"Adj Close":'Adj_Close'})
    df

    # https://stackoverflow.com/questions/40256338/calculating-average-true-range-atr-on-ohlc-data-with-python
    # fifth answer
    days = 5
    # calculate Average True Range over length of dataset
    ATR = pd.concat([df.High.sub(df.Low), df.High.sub(df.Adj_Close.shift()), df.Low.sub(df.Adj_Close.shift())], axis=1).max(1).ewm(span=days).mean()

    ATR = pd.DataFrame(ATR)
    ATR

    # merge ATR data to price dataframe
    merged_df = pd.concat([df, ATR], axis=1)


    # rename 0 column to 'ATR'
    merged_df.rename(columns={0:'ATR'}, inplace=True)

    # making index a 'Date' column
        # simplifies filtering by date in following steps
    merged_df = merged_df.reset_index()

    # build list of years in timeframe
    years = [year for year in range(2010,2020)]
    years

    # combine all winter data into single dataframe
    filtered_df = pd.DataFrame()

    for year in years:
        winter_df = merged_df.loc[(merged_df['Date'] >= f'{year}-12-01') & (merged_df['Date'] <f'{year+1}-03-01')]
        filtered_df = pd.concat([filtered_df, winter_df])

    ######################## build sub-datasets for each year ############################

    ############ 2011 - 2012 #############

    # price and ATR data for 2011-12-01 - 2012-02-29
    winter_11_12 = merged_df.loc[(merged_df['Date'] >= '2011-12-01') & (merged_df['Date'] < '2012-03-01')]
    winter_11_12

    #convert from date time to string
    winter_11_12 = winter_11_12.copy()
    winter_11_12["Date"] = winter_11_12["Date"].astype("str")

    # export JSON file
    winter_11_12.to_json(r'Price_data\ATR_11_12.json')

    ############ 2012 - 2013 #############

    # filter price/ATR data
    winter_12_13 = merged_df.loc[(merged_df['Date'] >= '2012-12-01') & (merged_df['Date'] < '2013-03-01')]
    winter_12_13    

    #convert from date time to string
    winter_12_13 = winter_12_13.copy()
    winter_12_13["Date"] = winter_12_13["Date"].astype("str")

    # export JSON file
    winter_12_13.to_json(r'Price_data\ATR_12_13.json')

    ############ 2013 - 2014 #############

    # filter price/ATR data
    winter_13_14 = merged_df.loc[(merged_df['Date'] >= '2013-12-01') & (merged_df['Date'] < '2014-03-01')]
    winter_13_14

    #convert from date time to string
    winter_13_14 = winter_13_14.copy()
    winter_13_14["Date"] = winter_13_14["Date"].astype("str")

    # export JSON file
    winter_13_14.to_json(r'Price_data\ATR_13_14.json')

    ############ 2014 - 2015 #############

    # filter price/ATR data
    winter_14_15 = merged_df.loc[(merged_df['Date'] >= '2014-12-01') & (merged_df['Date'] < '2015-03-01')]
    winter_14_15

    #convert from date time to string
    winter_14_15 = winter_14_15.copy()
    winter_14_15["Date"] = winter_14_15["Date"].astype("str")

    # export JSON file
    winter_14_15.to_json(r'Price_data\ATR_14_15.json')

    ############ 2015 - 2016 #############

    # filter price/ATR data
    winter_15_16 = merged_df.loc[(merged_df['Date'] >= '2015-12-01') & (merged_df['Date'] < '2016-03-01')]
    winter_15_16

    #convert from date time to string
    winter_15_16 = winter_15_16.copy()
    winter_15_16["Date"] = winter_15_16["Date"].astype("str")

    # export JSON file
    winter_15_16.to_json(r'Price_data\ATR_15_16.json')

    ############ 2016 - 2017 #############

    # filter price/ATR data
    winter_16_17 = merged_df.loc[(merged_df['Date'] >= '2016-12-01') & (merged_df['Date'] < '2017-03-01')]
    winter_16_17

    #convert from date time to string
    winter_16_17 = winter_16_17.copy()
    winter_16_17["Date"] = winter_16_17["Date"].astype("str")

    # export JSON file
    winter_16_17.to_json(r'Price_data\ATR_16_17.json')

    ############ 2017 - 2018 #############

    # filter price/ATR data
    winter_17_18 = merged_df.loc[(merged_df['Date'] >= '2017-12-01') & (merged_df['Date'] < '2018-03-01')]
    winter_17_18

    #convert from date time to string
    winter_17_18 = winter_17_18.copy()
    winter_17_18["Date"] = winter_17_18["Date"].astype("str")

    # export JSON file
    winter_17_18.to_json(r'Price_data\ATR_17_18.json')

    ############ 2018 - 2019 #############

    # filter price/ATR data
    winter_18_19 = merged_df.loc[(merged_df['Date'] >= '2018-12-01') & (merged_df['Date'] < '2019-03-01')]
    winter_18_19

    #convert from date time to string
    winter_18_19 = winter_18_19.copy()
    winter_18_19["Date"] = winter_18_19["Date"].astype("str")

    # export JSON file
    winter_18_19.to_json(r'Price_data\ATR_18_19.json')

    ############ 2019 - 2020 #############

    # filter price/ATR data
    winter_19_20 = merged_df.loc[(merged_df['Date'] >= '2019-12-01') & (merged_df['Date'] < '2020-03-01')]
    winter_19_20

    #convert from date time to string
    winter_19_20 = winter_19_20.copy()
    winter_19_20["Date"] = winter_19_20["Date"].astype("str")

    # export JSON file
    winter_19_20.to_json(r'Price_data\ATR_19_20.json')

    ############ Convert dataframes to dictionaries #############

    #Function to convert dataframes to dictionaries
    def get_naturalgas_dict(dataframe):
        naturalgas_dict = dataframe.to_dict(orient='records')
        return naturalgas_dict

    #Convert all natural gas dataframes to dictionaries
    winter_11_12_dict = get_naturalgas_dict(winter_11_12)
    winter_12_13_dict = get_naturalgas_dict(winter_12_13)
    winter_13_14_dict = get_naturalgas_dict(winter_13_14)
    winter_14_15_dict = get_naturalgas_dict(winter_14_15)
    winter_15_16_dict = get_naturalgas_dict(winter_15_16)
    winter_16_17_dict = get_naturalgas_dict(winter_16_17)
    winter_17_18_dict = get_naturalgas_dict(winter_17_18)
    winter_18_19_dict = get_naturalgas_dict(winter_18_19)
    winter_19_20_dict = get_naturalgas_dict(winter_19_20)

    #Create dictionary to hold all datasets to export
    naturalgas_datasets = {
        'winter_11_12': winter_11_12_dict,
        'winter_12_13': winter_12_13_dict,
        'winter_13_14': winter_13_14_dict,
        'winter_14_15': winter_14_15_dict,
        'winter_15_16': winter_15_16_dict,
        'winter_16_17': winter_16_17_dict,    
        'winter_17_18': winter_17_18_dict,
        'winter_18_19': winter_18_19_dict,
        'winter_19_20': winter_19_20_dict,
    }

    naturalgas_datasets

    #Functions to export dictionaries to jsons
    def export_data_to_json(data, filename):
        with open(filename, 'w') as file:
            json.dump(data, file)

    def export_datasets(datasets):
        data_folder = 'data'

        # Create 'data' folder if it doesn't exist
        if not os.path.exists(data_folder):
            os.makedirs(data_folder)

        for dataset_name, dataset in datasets.items():
            filename = os.path.join(data_folder, f"{dataset_name}_data.json")
            export_data_to_json(dataset, filename)

    export_datasets(naturalgas_datasets)

    return naturalgas_datasets

if __name__ == "__main__":
    app.run(debug=True)