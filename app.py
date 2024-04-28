from flask import Flask, request, jsonify, render_template
import requests
from dotenv import load_dotenv
import os
from datetime import datetime
from timezonefinder import TimezoneFinder
import pytz

app = Flask(__name__)

# Load environment variables from .env file
load_dotenv()

API_KEY = os.getenv('OPENWEATHERMAP_API_KEY')

tf = TimezoneFinder()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    if not city:
        return jsonify({'error': 'Missing argument: city'}), 400

    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&units=imperial&appid={API_KEY}"
    response = requests.get(url)
    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch weather data'}), 500

    data = response.json()
    lat, lon = data['coord']['lat'], data['coord']['lon']
    
    # Find the timezone of the given coordinates
    timezone_str = tf.timezone_at(lat=lat, lng=lon)
    timezone = pytz.timezone(timezone_str)
    city_time = datetime.now(timezone)

    time_str = city_time.strftime('As of %I:%M %p %Z')
    date_str = city_time.strftime('%A, %B %d')

    # Round temperature and wind speed
    temperature = round(data['main']['temp'])
    wind_speed = round(data['wind']['speed'])
    
    weather = {
        'city': data['name'],
        'time': time_str,
        'date': date_str,
        'temperature': temperature,
        'description': data['weather'][0]['description'],
        'humidity': data['main']['humidity'],
        'pressure': data['main']['pressure'],
        'wind_speed': wind_speed
    }

    return jsonify(weather)

if __name__ == '__main__':
    app.run(debug=True)
