from flask import Flask, request, jsonify
import requests
from dotenv import load_dotenv
import os

app = Flask(__name__)

load_dotenv()

API_KEY = os.getenv('OPENWEATHERMAP_API_KEY')

@app.route('/weather', methods=['GET'])
def get_weather():
    # Get the city from the query string
    city = request.args.get('city')
    if not city:
        return jsonify({'error': 'Missing argument: city'}), 400

    # Build the URL for the API request
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&units=imperial&appid={API_KEY}"

    # Make the API request
    response = requests.get(url)
    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch weather data'}), 500

    # Extract data from the response
    data = response.json()
    weather = {
        'city': city,
        'temperature': data['main']['temp'],
        'description': data['weather'][0]['description'],
        'humidity': data['main']['humidity'],
        'pressure': data['main']['pressure'],
        'wind_speed': data['wind']['speed']
    }

    return jsonify(weather)

if __name__ == '__main__':
    app.run(debug=True)
