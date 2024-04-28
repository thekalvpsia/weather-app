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
                    <div class="city-name">${data.city}</div>
                    <div class="time">${data.time}</div>
                    <div class="date">${data.date}</div>
                    <div class="temperature">${data.temperature}°F</div>
                    <div class="details">
                        <p class="detail-item">Description: <span>${data.description}</span></p>
                        <p class="detail-item">Precipitation: <span>${data.precipitation} mm</span></p>
                        <p class="detail-item">Humidity: <span>${data.humidity}%</span></p>
                        <p class="detail-item">Wind: <span>${data.wind_speed} mph</span></p>
                    </div>
                `;
                weatherResult.classList.add('result-shown');
            }
        })
        .catch(error => {
            document.getElementById('weatherResult').innerHTML = `<p>Error fetching weather data.</p>`;
        });
});
