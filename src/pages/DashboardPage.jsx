import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import DashboardCard from '@/components/layout/DashboardCard';
import { Sprout, LogOut } from 'lucide-react';
import { setUser } from '@/store/slices/authSlice';
import { dashboardImages } from '@/lib/images';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(setUser(null));
    navigate('/');
  };

  const handleAudioPlay = (text) => {
    // Placeholder for text-to-speech functionality
    console.log('Playing audio:', text);
  };

  const features = [
    {
      id: 1,
      title: 'Weather Updates',
      titleTe: 'వాతావరణం',
      image: dashboardImages.weather,
      route: '/weather',
      borderColor: 'border-blue-500',
    },
    {
      id: 2,
      title: 'Crop Advice',
      titleTe: 'పంట సలహాలు',
      image: dashboardImages.cropAdvice,
      route: '/crops',
      borderColor: 'border-green-500',
    },
    {
      id: 3,
      title: 'Seed Types',
      titleTe: 'విత్తన రకాలు',
      image: dashboardImages.seeds,
      route: '/seeds',
      borderColor: 'border-yellow-500',
    },
    {
      id: 4,
      title: 'Agriculture Shop',
      titleTe: 'వ్యవసాయ దుకాణం',
      image: dashboardImages.shop,
      route: '/products',
      borderColor: 'border-orange-500',
    },
    {
      id: 5,
      title: 'Market Prices',
      titleTe: 'మార్కెట్ ధరలు',
      image: dashboardImages.market,
      route: '/market-prices',
      borderColor: 'border-purple-500',
    },
    {
      id: 6,
      title: 'Drone Booking',
      titleTe: 'డ్రోన్ బుకింగ్',
      image: dashboardImages.drone,
      route: '/drone-booking',
      borderColor: 'border-indigo-500',
    },
  ];

  const getUserInitial = () => {
    return user?.full_name?.charAt(0)?.toUpperCase() || 'F';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sprout className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-green-600 font-poppins">
              CropSync
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 cursor-pointer border-2 border-green-600">
              <AvatarImage src={user?.profile_image_url} />
              <AvatarFallback className="bg-green-600 text-white text-lg font-bold">
                {getUserInitial()}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="font-poppins"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 font-telugu mb-2">
            స్వాగతం, {user?.full_name}!
          </h2>
          <p className="text-xl text-gray-600 font-poppins">
            Welcome, {user?.full_name}!
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature) => (
            <DashboardCard
              key={feature.id}
              title={feature.title}
              titleTe={feature.titleTe}
              image={feature.image}
              route={feature.route}
              borderColor={feature.borderColor}
              onAudioPlay={() => handleAudioPlay(feature.titleTe)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
