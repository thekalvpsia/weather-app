document.getElementById('weatherForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const city = document.getElementById('cityInput').value;
    const weatherResult = document.getElementById('weatherResult');
    weatherResult.style.opacity = '0';
    weatherResult.classList.remove('result-shown');
    weatherResult.innerHTML = '';
    
    fetch(`/weather?city=${encodeURIComponent(city)}`)
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => {
                    throw new Error(errData.message || 'Error fetching weather data.');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
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
                setTimeout(() => {
                    weatherResult.classList.add('result-shown');
                }, 100);
            }
        })
        .catch(error => {
            weatherResult.innerHTML = `<p class="error-message">${error.message}</p>`;
            weatherResult.classList.add('result-shown');
        });
});
