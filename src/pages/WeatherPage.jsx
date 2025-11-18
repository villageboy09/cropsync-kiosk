import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout, ArrowLeft, Droplets, Wind, Volume2, MapPin, ThermometerSun, CloudRain } from 'lucide-react';
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
    if (chance >= 40) return 'text-amber-600';
    return 'text-muted-foreground';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Sprout className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-primary">CropSync</h1>
          </div>
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 max-w-5xl">
        {/* Page Title */}
        <div className="mb-8 animate-fade-in-down">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-telugu">
                వాతావరణం
              </h2>
              <p className="text-muted-foreground">Weather Updates</p>
            </div>
            <Button variant="accent" size="sm" className="hidden sm:flex">
              <Volume2 className="mr-2 h-4 w-4" />
              <span className="font-telugu">వినండి</span>
            </Button>
          </div>

          {location && (
            <div className="flex items-center gap-2 mt-3 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <p className="text-sm">
                {location.village}, {location.district}
              </p>
            </div>
          )}
        </div>

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-2xl" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Current Weather */}
            {current && (
              <Card className="mb-8 overflow-hidden border-0 shadow-premium-lg animate-fade-in-up">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    {/* Main temp */}
                    <div className="text-center sm:text-left">
                      <div className="text-7xl sm:text-8xl mb-2">{getWeatherIcon(current.condition)}</div>
                      <h3 className="text-5xl sm:text-6xl font-bold tracking-tight">{current.temp}°</h3>
                      <p className="text-lg font-telugu mt-2">{current.condition_te}</p>
                      <p className="text-sm opacity-80">{current.condition}</p>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-6 sm:gap-8">
                      <div className="text-center">
                        <div className="p-3 bg-white/10 rounded-xl mb-2 inline-block">
                          <Droplets className="h-5 w-5" />
                        </div>
                        <p className="text-2xl font-bold">{current.humidity}%</p>
                        <p className="text-xs opacity-80">Humidity</p>
                      </div>
                      <div className="text-center">
                        <div className="p-3 bg-white/10 rounded-xl mb-2 inline-block">
                          <Wind className="h-5 w-5" />
                        </div>
                        <p className="text-2xl font-bold">{current.wind_speed}</p>
                        <p className="text-xs opacity-80">km/h</p>
                      </div>
                      <div className="text-center">
                        <div className="p-3 bg-white/10 rounded-xl mb-2 inline-block">
                          <CloudRain className="h-5 w-5" />
                        </div>
                        <p className="text-2xl font-bold">{current.rainfall}</p>
                        <p className="text-xs opacity-80">mm</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* 7-Day Forecast */}
            <div className="mb-8 animate-fade-in-up animation-delay-100">
              <h3 className="text-lg font-semibold mb-4 font-telugu">7 రోజుల అంచనా</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {forecast.map((day, index) => (
                  <Card
                    key={index}
                    className={`border-0 shadow-premium transition-all duration-200 hover:shadow-premium-md ${
                      index === 0 ? 'ring-2 ring-primary/20' : ''
                    }`}
                  >
                    <CardContent className="p-4 text-center">
                      <p className="text-sm font-semibold mb-1">
                        {index === 0 ? 'Today' : format(new Date(day.date), 'EEE')}
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        {format(new Date(day.date), 'MMM d')}
                      </p>

                      <div className="text-4xl mb-3">{getWeatherIcon(day.condition)}</div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-1.5 text-sm font-semibold">
                          <span className="text-red-500">{day.temp_max}°</span>
                          <span className="text-muted-foreground/50">/</span>
                          <span className="text-blue-500">{day.temp_min}°</span>
                        </div>
                        <div className={`flex items-center justify-center gap-1 text-xs ${getRainfallColor(day.rainfall_chance)}`}>
                          <Droplets className="h-3 w-3" />
                          <span>{day.rainfall_chance}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Weather Advisory */}
            <Card className="border-0 shadow-premium bg-amber-50 animate-fade-in-up animation-delay-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-amber-900 text-base">
                  <ThermometerSun className="h-5 w-5" />
                  <span className="font-telugu">వ్యవసాయ సలహా</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <p className="text-sm text-amber-900 font-telugu">
                  • రాబోయే 3 రోజుల్లో వర్షాలు అంచనా ఉన్నాయి. పంట రక్షణ చర్యలు తీసుకోండి.
                </p>
                <p className="text-sm text-amber-900 font-telugu">
                  • అధిక తేమ కారణంగా ఫంగల్ వ్యాధుల నివారణకు స్ప్రే చేయండి.
                </p>
                <p className="text-sm text-amber-900 font-telugu">
                  • నీటి నిర్వహణ మరియు డ్రైనేజీ వ్యవస్థను తనిఖీ చేయండి.
                </p>
                <p className="text-xs text-amber-700 mt-3 pt-3 border-t border-amber-200">
                  Rainfall expected in next 3 days. Take crop protection measures and check drainage systems.
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
