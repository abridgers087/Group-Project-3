# Import the dependencies.
import requests
from api_keys import rapid_api_key
import json
import os
from flask import Flask, jsonify

# Create an app, being sure to pass __name__
app = Flask(__name__)

# Gather the weather data and jsonify 
@app.route("/weather/jsonified")

def weather_data():

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
# @app.route("/naturalgas/jsonified")


if __name__ == "__main__":
    app.run(debug=True)