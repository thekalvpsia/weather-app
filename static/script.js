document.getElementById('weatherForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const city = document.getElementById('cityInput').value;
    fetch(`/weather?city=${encodeURIComponent(city)}`)
        .then(response => response.json())
        .then(data => {
            const weatherResult = document.getElementById('weatherResult');
            if (data.error) {
                weatherResult.innerHTML = `<p>Error: ${data.error}</p>`;
            } else {
                weatherResult.innerHTML = `
                    <p>Temperature: ${data.temperature}°F</p>
                    <p>Description: ${data.description}</p>
                    <p>Humidity: ${data.humidity}%</p>
                    <p>Pressure: ${data.pressure} hPa</p>
                    <p>Wind Speed: ${data.wind_speed} mph</p>
                `;
            }
        })
        .catch(error => {
            document.getElementById('weatherResult').innerHTML = `<p>Error fetching weather data.</p>`;
        });
});
