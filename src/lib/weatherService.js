const API_KEY = '7E7P7EAAR6GGWYM3Q44J66HR2';
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

// Helper to get current location
const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                (error) => {
                    reject(error);
                }
            );
        }
    });
};

// Generate advisory based on weather conditions
const generateAdvisory = (current, forecast) => {
    const advisories = [];

    // Rain Advisory
    if (current.precip > 0 || current.icon.includes('rain')) {
        advisories.push({
            type: 'warning',
            title: 'Rain Alert (వర్ష సూచన)',
            message: 'Heavy rain expected. Postpone spraying pesticides. (భారీ వర్షం కురిసే అవకాశం ఉంది. పురుగుమందుల పిచికారీ వాయిదా వేయండి.)',
            icon: 'CloudRain'
        });
    }

    // Temperature Advisory
    if (current.temp > 35) {
        advisories.push({
            type: 'alert',
            title: 'High Heat (అధిక ఉష్ణోగ్రత)',
            message: 'High temperatures detected. Ensure adequate irrigation for crops. (అధిక ఉష్ణోగ్రతలు నమోదవుతున్నాయి. పంటలకు తగినంత నీరు అందేలా చూసుకోండి.)',
            icon: 'Sun'
        });
    }

    // Wind Advisory
    if (current.windspeed > 20) {
        advisories.push({
            type: 'caution',
            title: 'High Winds (బలమైన గాలులు)',
            message: 'Strong winds expected. Secure young plants and greenhouse structures. (బలమైన గాలులు వీచే అవకాశం ఉంది. లేత మొక్కలు మరియు గ్రీన్ హౌస్ నిర్మాణాలను రక్షించుకోండి.)',
            icon: 'Wind'
        });
    }

    // Default Advisory if conditions are good
    if (advisories.length === 0) {
        advisories.push({
            type: 'success',
            title: 'Good Conditions (అనుకూల వాతావరణం)',
            message: 'Weather is favorable for all agricultural activities. (వ్యవసాయ పనులకు వాతావరణం అనుకూలంగా ఉంది.)',
            icon: 'Sprout'
        });
    }

    return advisories[0]; // Return the most critical advisory
};

export const getWeatherData = async () => {
    try {
        // Default to Vijayawada if location access fails
        let lat = 16.5062;
        let lon = 80.6480;

        try {
            const position = await getCurrentLocation();
            lat = position.lat;
            lon = position.lon;
        } catch (e) {
            console.warn('Location access denied or failed, using default location.');
        }

        const response = await fetch(
            `${BASE_URL}/${lat},${lon}?unitGroup=metric&key=${API_KEY}&contentType=json`
        );

        if (!response.ok) {
            throw new Error('Weather data fetch failed');
        }

        const data = await response.json();
        const current = data.currentConditions;

        // Clean up address (e.g., "Vijayawada, Andhra Pradesh, India" -> "Vijayawada")
        let locationName = data.address;
        if (data.resolvedAddress) {
            locationName = data.resolvedAddress.split(',')[0].trim();
        }

        // Process forecast (next 5 days)
        const forecast = data.days.slice(1, 6).map(day => ({
            day: new Date(day.datetime).toLocaleDateString('en-US', { weekday: 'short' }),
            temp: Math.round(day.temp),
            icon: day.icon,
            condition: day.conditions
        }));

        const advisory = generateAdvisory(current, forecast);

        return {
            location: locationName,
            current: {
                temp: Math.round(current.temp),
                condition: current.conditions,
                humidity: Math.round(current.humidity),
                windSpeed: Math.round(current.windspeed),
                description: current.description,
                icon: current.icon,
                precip: current.precip
            },
            forecast,
            advisory
        };
    } catch (error) {
        console.error('Error in weather service:', error);
        throw error;
    }
};

export const getWeatherIcon = (condition) => {
    if (!condition) return 'Sun';
    const lower = condition.toLowerCase();
    if (lower.includes('rain')) return 'CloudRain';
    if (lower.includes('cloud') || lower.includes('overcast')) return 'Cloud';
    if (lower.includes('wind')) return 'Wind';
    if (lower.includes('clear') || lower.includes('sun')) return 'Sun';
    return 'Sun';
};
