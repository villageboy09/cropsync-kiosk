import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout, ArrowLeft, Cloud, Droplets, Wind, Volume2, MapPin } from 'lucide-react';
import { fetchWeatherData } from '@/store/slices/weatherSlice';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const WeatherPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { location, current, forecast, loading } = useSelector((state) => state.weather);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchWeatherData(user.id));
    }
  }, [dispatch, user]);

  const getWeatherIcon = (condition) => {
    const conditionLower = condition?.toLowerCase() || '';
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) return '☀️';
    if (conditionLower.includes('rain')) return '🌧️';
    if (conditionLower.includes('cloud')) return '☁️';
    if (conditionLower.includes('storm')) return '⛈️';
    if (conditionLower.includes('fog') || conditionLower.includes('mist')) return '🌫️';
    return '🌤️';
  };

  const getRainfallColor = (chance) => {
    if (chance >= 70) return 'text-blue-600';
    if (chance >= 40) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sprout className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-green-600 font-poppins">CropSync</h1>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 font-telugu mb-2">
            🌦️ వాతావరణం
          </h2>
          <p className="text-xl text-gray-600 font-poppins">
            Weather Updates
          </p>
          {location && (
            <div className="flex items-center justify-center gap-2 mt-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <p className="text-sm font-poppins">
                {location.village}, {location.district}, {location.state}
              </p>
            </div>
          )}
        </div>

        {/* Audio Button */}
        <div className="mb-6 flex justify-center">
          <Button className="bg-orange-500 hover:bg-orange-600 font-telugu">
            <Volume2 className="mr-2 h-5 w-5" />
            వాతావరణ సమాచారం వినండి
          </Button>
        </div>

        {loading ? (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Current Weather */}
            {current && (
              <Card className="mb-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="text-8xl mb-4">{getWeatherIcon(current.condition)}</div>
                    <h3 className="text-5xl font-bold mb-2 font-poppins">{current.temp}°C</h3>
                    <p className="text-xl font-telugu mb-1">{current.condition_te}</p>
                    <p className="text-lg opacity-90 font-poppins">{current.condition}</p>
                    
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/30">
                      <div>
                        <Droplets className="h-6 w-6 mx-auto mb-2" />
                        <p className="text-sm opacity-80 font-poppins">Humidity</p>
                        <p className="text-xl font-bold font-poppins">{current.humidity}%</p>
                      </div>
                      <div>
                        <Wind className="h-6 w-6 mx-auto mb-2" />
                        <p className="text-sm opacity-80 font-poppins">Wind</p>
                        <p className="text-xl font-bold font-poppins">{current.wind_speed} km/h</p>
                      </div>
                      <div>
                        <Cloud className="h-6 w-6 mx-auto mb-2" />
                        <p className="text-sm opacity-80 font-poppins">Rainfall</p>
                        <p className="text-xl font-bold font-poppins">{current.rainfall} mm</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 7-Day Forecast */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-4 font-telugu">7 రోజుల అంచనా</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {forecast.map((day, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm font-semibold mb-2 font-poppins">
                        {index === 0 ? 'Today' : format(new Date(day.date), 'EEE')}
                      </p>
                      <p className="text-xs text-gray-500 mb-3 font-poppins">
                        {format(new Date(day.date), 'MMM dd')}
                      </p>
                      
                      <div className="text-5xl mb-3">{getWeatherIcon(day.condition)}</div>
                      
                      <div className="space-y-1">
                        <p className="text-sm font-telugu text-gray-700">{day.condition_te}</p>
                        <div className="flex items-center justify-center gap-2 text-lg font-bold font-poppins">
                          <span className="text-red-500">{day.temp_max}°</span>
                          <span className="text-gray-400">/</span>
                          <span className="text-blue-500">{day.temp_min}°</span>
                        </div>
                        <div className={`flex items-center justify-center gap-1 text-xs ${getRainfallColor(day.rainfall_chance)}`}>
                          <Droplets className="h-3 w-3" />
                          <span className="font-poppins">{day.rainfall_chance}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Weather Advisory */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-900 font-telugu">
                  ⚠️ వ్యవసాయ సలహా
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-yellow-900 font-telugu">
                  • రాబోయే 3 రోజుల్లో వర్షాలు అంచనా ఉన్నాయి. పంట రక్షణ చర్యలు తీసుకోండి.
                </p>
                <p className="text-sm text-yellow-900 font-telugu">
                  • అధిక తేమ కారణంగా ఫంగల్ వ్యాధుల నివారణకు స్ప్రే చేయండి.
                </p>
                <p className="text-sm text-yellow-900 font-telugu">
                  • నీటి నిర్వహణ మరియు డ్రైనేజీ వ్యవస్థను తనిఖీ చేయండి.
                </p>
                <p className="text-xs text-yellow-800 font-poppins mt-3">
                  Agricultural Advisory: Rainfall expected in next 3 days. Take crop protection measures and check drainage systems.
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default WeatherPage;
