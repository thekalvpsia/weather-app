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
                    <div class="weather-icon">
                        <img src="http://openweathermap.org/img/wn/${data.icon.replace('d', 'n')}@2x.png" alt="${data.description}">
                    </div>
                    <div class="temperature">${data.temperature}°F</div>
                    <div class="details">
                        <p class="detail-item">Description: <span>${data.description}</span></p>
                        <p class="detail-item">Precipitation: <span>${data.precipitation} mm</span></p>
                        <p class="detail-item">Humidity: <span>${data.humidity}%</span></p>
                        <p class="detail-item">Wind: <span>${data.wind_speed} mph</span></p>
                    </div>
                    <canvas id="forecastChart"></canvas>
                `;
                const ctx = document.getElementById('forecastChart').getContext('2d');
                const forecastChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: data.forecasts.map(f => f.time),
                        datasets: [{
                            label: 'Temperature',
                            data: data.forecasts.map(f => f.temperature),
                            fill: false,
                            borderColor: 'white',
                            tension: 0.1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: false,
                                ticks: {
                                    stepSize: 1,
                                    callback: function(value) {
                                        if (value % 1 === 0) {
                                            return value;
                                        }
                                    }
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                labels: {
                                    color: 'white'
                                }
                            }
                        }
                    }
                });
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
