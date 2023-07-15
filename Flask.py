from flask import Flask, jsonify
import pymongo
from flask_cors import CORS
from datetime import datetime
from dateutil.parser import parse as parse_date

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
        f"/<int:year>/weather_data/<city>"
        f"/<int:year>/futures_data"        
    )

from datetime import datetime

@app.route("/<int:year>/weather_data/<city>/")
def weather(city, year):
    # Convert the city name to lowercase
    city = city.lower()

    # Determine the start and end dates based on the provided year
    start_date = f"{year}-12-01"
    end_date = f"{year+1}-02-28"

    # Query the weather data within the specified winter season
    weather_data = db.weather_data.find({
        "city": {"$regex": f"^{city}$", "$options": "i"},
        "date": {"$gte": start_date, "$lte": end_date}
    }).sort("date", 1)

    # Convert the queried data into a list of dictionaries
    weather_list = []
    for data in weather_data:
        # Get the ObjectId and convert it to a string
        data['_id'] = str(data['_id'])

        # Append the modified data entry to the list
        weather_list.append(data)

    # Return the weather data as JSON
    return jsonify(weather_list)

# @app.route("/futures_data/Winter<int:winter_number>")
# def futures(winter_number):
#     winter_label = f"Winter {winter_number}"
    
#     # Query the futures data
#     futures_data = db.futures_data.find({"Label": winter_label})

#     # Convert the queried data into a list of dictionaries
#     futures_list = []
#     for data in futures_data:
#         futures_list.append({
#             'Winter': data['Label'],
#             'Date': data['Date'],
#             'Open': data['Open'],
#             'High': data['High'],
#             'Low': data['Low'],
#             'Close': data['Close'],
#             'Adj_Close': data['Adj_Close'],
#             'Volume': data['Volume'],
#             'ATR': data['ATR']
#         })

#     # Return the futures data as JSON
#     return jsonify(futures_list)

@app.route("/<int:year>/futures_data")
def futures(year):
    # Determine the start and end dates based on the provided year
    start_date = f"{year}-12-01"
    end_date = f"{year+1}-02-28"

    # Query the futures data within the specified winter season
    futures_data = db.futures_data.find({
        "Date": {"$gte": start_date, "$lte": end_date}
    }).sort("Date", 1)

    # Convert the queried data into a list of dictionaries
    futures_list = []
    for data in futures_data:
        futures_list.append({
            'Year': year,
            'Date': data['Date'],
            'Open': data['Open'],
            'High': data['High'],
            'Low': data['Low'],
            'Close': data['Close'],
            'Adj_Close': data['Adj_Close'],
            'Volume': data['Volume'],
            'ATR': data['ATR']
        })

    return jsonify(futures_list)


if __name__ == '__main__':
    app.run(debug=True)
