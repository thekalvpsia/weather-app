from flask import Flask, request, jsonify, render_template
import requests
from dotenv import load_dotenv
import os
from datetime import datetime
from timezonefinder import TimezoneFinder
import pytz

app = Flask(__name__)
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

    current_url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&units=imperial&appid={API_KEY}"
    forecast_url = f"http://api.openweathermap.org/data/2.5/forecast?q={city}&units=imperial&appid={API_KEY}"

    current_response = requests.get(current_url)
    forecast_response = requests.get(forecast_url)
    if current_response.status_code != 200 or forecast_response.status_code != 200:
        return jsonify({'error': 'Failed to fetch weather data'}), 500

    current_data = current_response.json()
    forecast_data = forecast_response.json()
    
    # Timezone handling
    lat, lon = current_data['coord']['lat'], current_data['coord']['lon']
    timezone_str = tf.timezone_at(lat=lat, lng=lon)
    timezone = pytz.timezone(timezone_str)

    # Current weather formatting
    city_time = datetime.now(timezone)
    time_str = city_time.strftime('As of %I:%M %p %Z')
    date_str = city_time.strftime('%A, %B %d')
    
    # Forecast data handling
    forecasts = []
    for entry in forecast_data['list'][:5]:
        forecast_time = datetime.fromtimestamp(entry['dt'], tz=timezone)
        forecast = {
            'time': forecast_time.strftime('%I:%M %p'),
            'temperature': round(entry['main']['temp'])
        }
        forecasts.append(forecast)

    # Get precipitation data, checking for rain or snow
    precipitation = 0
    if 'rain' in current_data and '1h' in current_data['rain']:
        precipitation = current_data['rain']['1h']  # Rainfall in mm
    elif 'snow' in current_data and '1h' in current_data['snow']:
        precipitation = current_data['snow']['1h']  # Snowfall in mm
    
    weather = {
        'city': current_data['name'],
        'time': time_str,
        'date': date_str,
        'temperature': round(current_data['main']['temp']),
        'description': current_data['weather'][0]['description'],
        'precipitation': precipitation,
        'humidity': current_data['main']['humidity'],
        'wind_speed': round(current_data['wind']['speed']),
        'forecasts': forecasts
    }

    return jsonify(weather)

if __name__ == '__main__':
    app.run(debug=True)
