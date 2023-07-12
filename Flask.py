from flask import Flask, jsonify
import pymongo
from flask_cors import CORS
from datetime import datetime
from bson import ObjectId

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
        f"/weather_data/(city name)<br/>"
        f"/futures_data<br/>"        
    )

@app.route("/weather_data/<city>")
def weather(city):
    # Query the weather data
    weather_data = db.weather_data.find({"city": city})

    # Convert the queried data into a list of dictionaries
    weather_list = []
    for data in weather_data:
        # Get the ObjectId and convert it to a string
        data['_id'] = str(data['_id'])

        # Get the date from the data entry
        date_str = data['date']
        date = datetime.strptime(date_str, "%Y-%m-%d")

        # Determine the winter number based on the date
        if date.month in [12, 1, 2]:
            winter_number = date.year - 2010
        else:
            winter_number = date.year - 2011 + 1

        # Add the 'Winter' label to the data entry
        winter_label = f"Winter {winter_number}"
        data['Winter'] = winter_label

        # Append the modified data entry to the list
        weather_list.append(data)

    # Return the weather data as JSON
    return jsonify(weather_list)

@app.route("/futures_data/Winter<int:winter_number>")
def futures(winter_number):
    winter_label = f"Winter {winter_number}"
    
    # Query the futures data
    futures_data = db.futures_data.find({"Label": winter_label})

    # Convert the queried data into a list of dictionaries
    futures_list = []
    for data in futures_data:
        futures_list.append({
            'Winter': data['Label'],
            'Date': data['Date'],
            'Open': data['Open'],
            'High': data['High'],
            'Low': data['Low'],
            'Close': data['Close'],
            'Adj_Close': data['Adj_Close'],
            'Volume': data['Volume'],
            'ATR': data['ATR']
        })

    # Return the futures data as JSON
    return jsonify(futures_list)



if __name__ == '__main__':
    app.run(debug=True)
