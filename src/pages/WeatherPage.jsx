import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, Wind, Droplets, ArrowLeft, AlertTriangle, CheckCircle, Info, MapPin, Thermometer, Eye, Gauge } from 'lucide-react';
import { getWeatherData, getWeatherIcon } from '@/lib/weatherService';
import { logout } from '@/store/slices/authSlice';

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

const WeatherPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

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

    // Update time every minute
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // Format date: "29, నవంబర్ 2025, శనివారం 07:35 AM"
  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long', hour: '2-digit', minute: '2-digit' };
    // Using 'en-IN' for now as 'te-IN' might need specific font support for some browsers, but trying te-IN
    return date.toLocaleDateString('te-IN', options);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins flex flex-col">
      {/* Header */}
      <header className="bg-white px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4ade80] rounded-full flex items-center justify-center shadow-sm">
            <span className="text-xl font-bold text-white">C</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1a5d2c] tracking-tight">CarbonMint</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate('/dashboard')}
            className="bg-[#4ade80] hover:bg-[#22c55e] text-white font-bold font-telugu"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            డాష్‌బోర్డ్ (Dashboard)
          </Button>

          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="font-telugu font-medium text-gray-700">హైదరాబాద్</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Skeleton className="h-[500px] lg:col-span-2 rounded-3xl" />
              <Skeleton className="h-[500px] rounded-3xl" />
            </div>
          ) : error ? (
            <div className="text-center p-12 bg-red-50 rounded-3xl border border-red-100">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-400" />
              <p className="text-red-600 font-medium mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Panel - Weather Info */}
              <Card className="lg:col-span-2 rounded-[2rem] border-0 shadow-sm bg-white p-8 relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-4xl font-bold text-[#1a5d2c] mb-2">Hyderabad</h2>
                  <p className="text-gray-500 font-telugu text-lg mb-8">
                    {formatDate(currentDate)}
                  </p>

                  <div className="flex items-center justify-between mb-12">
                    <div>
                      <h3 className="text-[8rem] font-bold text-[#4ade80] leading-none tracking-tighter">
                        {weather?.current?.temp}°
                      </h3>
                      <p className="text-2xl font-bold text-gray-600 font-telugu mt-2">
                        {weather?.current?.condition === 'Mist' ? 'పొగమంచు' : weather?.current?.condition}
                      </p>
                      <p className="text-lg text-gray-400 font-telugu">
                        అనుభూతి: {weather?.current?.temp}°
                      </p>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-yellow-200 blur-3xl opacity-20 rounded-full"></div>
                      <WeatherIconComponent icon={weather?.current?.icon} className="w-48 h-48 text-yellow-400 drop-shadow-xl" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
                      <Droplets className="w-6 h-6 text-[#4ade80]" />
                      <span className="text-xl font-bold text-gray-700">{weather?.current?.humidity}%</span>
                      <span className="text-xs text-gray-400 uppercase tracking-wider">Humidity</span>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
                      <Wind className="w-6 h-6 text-[#4ade80]" />
                      <span className="text-xl font-bold text-gray-700">{weather?.current?.windSpeed} <span className="text-sm">m/s</span></span>
                      <span className="text-xs text-gray-400 uppercase tracking-wider">Wind</span>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
                      <Gauge className="w-6 h-6 text-[#4ade80]" />
                      <span className="text-xl font-bold text-gray-700">1016 <span className="text-sm">hPa</span></span>
                      <span className="text-xs text-gray-400 uppercase tracking-wider">Pressure</span>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
                      <Eye className="w-6 h-6 text-[#4ade80]" />
                      <span className="text-xl font-bold text-gray-700">3.0 <span className="text-sm">km</span></span>
                      <span className="text-xs text-gray-400 uppercase tracking-wider">Visibility</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Right Panel - Agricultural Advice */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[#4ade80] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">🌱</span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#1a5d2c] font-telugu">వ్యవసాయ సలహాలు</h2>
                </div>

                <Card className="rounded-[2rem] border-0 shadow-sm bg-white p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#4ade80] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-700 font-telugu text-lg leading-relaxed font-medium">
                        ప్రస్తుత వాతావరణం పంటలకు అనుకూలంగా ఉంది. ప్రత్యేక హెచ్చరికలు లేవు.
                      </p>
                      <p className="text-sm text-gray-400 mt-2 font-telugu">
                        (Current weather is favorable for crops. No specific alerts.)
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Additional Advice Card (Optional placeholder for more content) */}
                <Card className="rounded-[2rem] border-0 shadow-sm bg-white p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Info className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-gray-700 font-telugu text-lg leading-relaxed font-medium">
                        నీటి పారుదల సౌకర్యాలను తనిఖీ చేసుకోండి.
                      </p>
                      <p className="text-sm text-gray-400 mt-2 font-telugu">
                        (Check irrigation facilities.)
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WeatherPage;
