import React, { useState, useEffect } from 'react';
import AppBar from '@/components/layout/AppBar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, Wind, Droplets, ArrowLeft, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getWeatherData, getWeatherIcon } from '@/lib/weatherService';

const WeatherIconComponent = ({ icon, className }) => {
  const iconName = getWeatherIcon(icon);
  switch (iconName) {
    case 'Sun': return <Sun className={className} />;
    case 'CloudRain': return <CloudRain className={className} />;
    case 'Cloud': return <Cloud className={className} />;
    case 'Wind': return <Wind className={className} />;
    default: return <Sun className={className} />;
  }
};

const AdvisoryCard = ({ advisory }) => {
  if (!advisory) return null;

  const colors = {
    warning: 'bg-red-50 border-red-200 text-red-800',
    alert: 'bg-orange-50 border-orange-200 text-orange-800',
    caution: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  };

  const icons = {
    warning: <AlertTriangle className="h-6 w-6 text-red-600" />,
    alert: <AlertTriangle className="h-6 w-6 text-orange-600" />,
    caution: <Info className="h-6 w-6 text-yellow-600" />,
    success: <CheckCircle className="h-6 w-6 text-green-600" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl border ${colors[advisory.type]} mb-6`}
    >
      <div className="flex items-start gap-4">
        <div className="p-2 bg-white rounded-xl shadow-sm">
          {icons[advisory.type]}
        </div>
        <div>
          <h3 className="text-lg font-bold mb-1">{advisory.title}</h3>
          <p className="text-sm opacity-90 leading-relaxed">{advisory.message}</p>
        </div>
      </div>
    </motion.div>
  );
};

const WeatherPage = () => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getWeatherData();
        setWeather(data);
      } catch (error) {
        console.error('Failed to fetch weather', error);
        setError('Failed to load weather data. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20 pt-24">
      <AppBar />

      <main className="container mx-auto px-4 py-6 space-y-6 max-w-5xl">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full hover:bg-primary/10"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold font-telugu">వాతావరణం (Weather)</h1>
              {loading ? (
                <Skeleton className="h-4 w-32 mt-1" />
              ) : weather?.location && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  📍 {weather.location}
                </p>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {/* Advisory Skeleton */}
            <Skeleton className="h-32 w-full rounded-2xl" />

            {/* Current Weather Skeleton */}
            <Skeleton className="h-80 w-full rounded-xl" />

            {/* Forecast Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center p-8 text-red-500 bg-red-50 rounded-xl border border-red-100">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-400" />
            <p className="font-medium">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">Retry</Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Advisory Card */}
            <AdvisoryCard advisory={weather.advisory} />

            {/* Current Weather Card */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>

              <CardContent className="p-8 relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-medium opacity-90">Today</p>
                    <h2 className="text-7xl font-bold mt-2 tracking-tighter">{weather.current.temp}°</h2>
                    <p className="text-2xl mt-2 font-medium capitalize">{weather.current.condition}</p>
                    <p className="text-base opacity-75 mt-1 max-w-md">{weather.current.description}</p>
                  </div>
                  <WeatherIconComponent icon={weather.current.icon} className="h-32 w-32 text-yellow-300 animate-pulse drop-shadow-lg" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center gap-3 border border-white/10">
                    <Wind className="h-6 w-6 opacity-80" />
                    <div>
                      <p className="text-xs opacity-70">Wind</p>
                      <p className="font-bold text-lg">{weather.current.windSpeed} <span className="text-xs font-normal">km/h</span></p>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center gap-3 border border-white/10">
                    <Droplets className="h-6 w-6 opacity-80" />
                    <div>
                      <p className="text-xs opacity-70">Humidity</p>
                      <p className="font-bold text-lg">{weather.current.humidity}<span className="text-xs font-normal">%</span></p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Forecast */}
            <div>
              <h3 className="text-xl font-bold mb-4 font-telugu flex items-center gap-2">
                <span className="bg-primary/10 p-1 rounded-md">📅</span>
                రాబోయే 5 రోజులు (Next 5 Days)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {weather.forecast.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/60 backdrop-blur-md border-white/20 hover:bg-white/80 transition-all hover:scale-105 duration-300 shadow-sm hover:shadow-md">
                      <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-3">
                        <p className="font-medium text-muted-foreground uppercase text-xs tracking-wider">{day.day}</p>
                        <WeatherIconComponent icon={day.icon} className="h-10 w-10 text-primary" />
                        <p className="text-2xl font-bold text-foreground">{day.temp}°</p>
                        <p className="text-xs text-muted-foreground capitalize bg-secondary/10 px-2 py-1 rounded-full">{day.condition}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default WeatherPage;
