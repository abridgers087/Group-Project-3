import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify
import pymongo
from flask_cors import CORS

# MongoDB Setup
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client.project_3_db

# Flask Setup
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Flask Routes
@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/weather_data<br/>"
        f"/futures_data<br/>"
        f"/graph_data<br/>"
    )

@app.route("/weather_data/<city>")
def weather(city):
    # Query the weather data
    weather_data = db.weather_data.find({"city": city})

    # Convert the queried data into a list of dictionaries
    weather_list = []
    for data in weather_data:
        weather_list.append({
            'city': city,
            'date': data['date'],
            'tavg_fahrenheit': data['tavg_fahrenheit'],
            'tmin_fahrenheit': data['tmin_fahrenheit'],
            'tmax_fahrenheit': data['tmax_fahrenheit']
        })

    # Return the weather data as JSON
    return jsonify(weather_list)

if __name__ == '__main__':
    app.run(debug=True)
