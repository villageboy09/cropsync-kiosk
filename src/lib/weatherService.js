// Mock weather data service
export const getWeatherData = async (lat, lon) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        current: {
            temp: 28,
            condition: 'Cloudy',
            humidity: 65,
            windSpeed: 12,
            description: 'Partly cloudy with light breeze',
            icon: 'cloudy'
        },
        forecast: [
            { day: 'Mon', temp: 29, icon: 'sun' },
            { day: 'Tue', temp: 27, icon: 'rain' },
            { day: 'Wed', temp: 28, icon: 'cloudy' },
            { day: 'Thu', temp: 30, icon: 'sun' },
            { day: 'Fri', temp: 26, icon: 'rain' }
        ]
    };
};

export const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
        case 'sun':
        case 'clear':
            return 'Sun';
        case 'rain':
            return 'CloudRain';
        case 'cloudy':
        case 'clouds':
            return 'Cloud';
        default:
            return 'Sun';
    }
};
