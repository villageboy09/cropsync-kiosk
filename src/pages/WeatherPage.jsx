import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, Wind, Droplets, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getWeatherData } from '@/lib/weatherService';

const WeatherIcon = ({ icon, className }) => {
  switch (icon) {
    case 'sun': return <Sun className={className} />;
    case 'rain': return <CloudRain className={className} />;
    case 'cloudy': return <Cloud className={className} />;
    default: return <Sun className={className} />;
  }
};

const WeatherPage = () => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getWeatherData();
        setWeather(data);
      } catch (error) {
        console.error('Failed to fetch weather', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full hover:bg-primary/10"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold font-telugu">వాతావరణం (Weather)</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Current Weather Card */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>

              <CardContent className="p-8 relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-medium opacity-90">Today</p>
                    <h2 className="text-6xl font-bold mt-2">{weather.current.temp}°</h2>
                    <p className="text-xl mt-2 font-medium">{weather.current.condition}</p>
                  </div>
                  <WeatherIcon icon={weather.current.icon} className="h-24 w-24 text-yellow-300 animate-pulse" />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 flex items-center gap-3">
                    <Wind className="h-6 w-6" />
                    <div>
                      <p className="text-xs opacity-80">Wind</p>
                      <p className="font-bold">{weather.current.windSpeed} km/h</p>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 flex items-center gap-3">
                    <Droplets className="h-6 w-6" />
                    <div>
                      <p className="text-xs opacity-80">Humidity</p>
                      <p className="font-bold">{weather.current.humidity}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Forecast */}
            <div>
              <h3 className="text-xl font-bold mb-4 font-telugu">రాబోయే 5 రోజులు (Next 5 Days)</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {weather.forecast.map((day, index) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/60 backdrop-blur-md border-white/20 hover:bg-white/80 transition-colors">
                      <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
                        <p className="font-medium text-muted-foreground">{day.day}</p>
                        <WeatherIcon icon={day.icon} className="h-8 w-8 text-primary" />
                        <p className="text-xl font-bold">{day.temp}°</p>
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
