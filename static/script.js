document.getElementById('weatherForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const city = document.getElementById('cityInput').value;
    const weatherResult = document.getElementById('weatherResult');
    weatherResult.classList.remove('result-shown');
    weatherResult.innerHTML = '';
    
    fetch(`/weather?city=${encodeURIComponent(city)}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                weatherResult.innerHTML = `<p>Error: ${data.error}</p>`;
            } else {
                weatherResult.innerHTML = `
                    <h2>${data.city}</h2>
                    <p>${data.time}</p>
                    <p>${data.date}</p>
                    <p>Temperature: ${data.temperature}°F</p>
                    <p>Description: ${data.description}</p>
                    <p>Humidity: ${data.humidity}%</p>
                    <p>Pressure: ${data.pressure} hPa</p>
                    <p>Wind Speed: ${data.wind_speed} mph</p>
                `;
                weatherResult.classList.add('result-shown');
            }
        })
        .catch(error => {
            document.getElementById('weatherResult').innerHTML = `<p>Error fetching weather data.</p>`;
        });
});
