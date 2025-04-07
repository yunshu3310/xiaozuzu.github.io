// WeatherAPI配置
const WEATHER_API_KEY = '08e435ad8cd74f73b7030628250203'; // 需要替换为实际的API密钥，请更换为你的API密钥
// 天气API URL，使用WeatherAPI的免费版，需要注册并获取API密钥，免费版的API限制为1000次/日，需要注意使用限制
const WEATHER_API_URL = 'https://api.weatherapi.com/v1/current.json';

// 获取天气信息
async function getWeatherData(latitude, longitude) {
    try {
        const response = await fetch(`${WEATHER_API_URL}?key=${WEATHER_API_KEY}&q=${latitude},${longitude}&aqi=no`);
        if (!response.ok) {
            throw new Error('Weather data fetch failed');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

// 更新天气显示
function updateWeatherDisplay(weatherData) {
    if (!weatherData) {
        document.getElementById('weather-container').innerHTML = '<p class="weather-error">无法获取天气信息</p>';
        return;
    }

    const { current, location } = weatherData;
    const weatherHtml = `
        <div class="weather-info">
            <img class="weather-icon" src="${current.condition.icon}" alt="${current.condition.text}">
            <div class="weather-temp">${current.temp_c}°C</div>
        </div>
    `;

    document.getElementById('weather-container').innerHTML = weatherHtml;
}

// 获取用户位置并更新天气
function initWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const weatherData = await getWeatherData(
                    position.coords.latitude,
                    position.coords.longitude
                );
                updateWeatherDisplay(weatherData);
            },
            (error) => {
                console.error('Error getting location:', error);
                // 默认使用北京的位置
                getWeatherData('39.9042', '116.4074')
                    .then(updateWeatherDisplay)
                    .catch(console.error);
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
        // 默认使用北京的位置
        getWeatherData('39.9042', '116.4074')
            .then(updateWeatherDisplay)
            .catch(console.error);
    }
}

// 页面加载完成后初始化天气信息
document.addEventListener('DOMContentLoaded', initWeather);