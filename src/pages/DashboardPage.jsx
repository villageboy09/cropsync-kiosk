import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import DashboardCard from '@/components/layout/DashboardCard';
import {
  Sprout,
  LogOut,
  Cloud,
  Leaf,
  Wheat,
  ShoppingBag,
  TrendingUp,
  Plane
} from 'lucide-react';
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
    console.log('Playing audio:', text);
  };

  const features = [
    {
      id: 1,
      title: 'Weather Updates',
      titleTe: 'వాతావరణం',
      image: dashboardImages.weather,
      route: '/weather',
      icon: Cloud,
      accentColor: 'bg-blue-500',
    },
    {
      id: 2,
      title: 'Crop Advisory',
      titleTe: 'పంట సలహాలు',
      image: dashboardImages.cropAdvice,
      route: '/crops',
      icon: Leaf,
      accentColor: 'bg-primary',
    },
    {
      id: 3,
      title: 'Seed Varieties',
      titleTe: 'విత్తన రకాలు',
      image: dashboardImages.seeds,
      route: '/seeds',
      icon: Wheat,
      accentColor: 'bg-amber-500',
    },
    {
      id: 4,
      title: 'Agriculture Shop',
      titleTe: 'వ్యవసాయ దుకాణం',
      image: dashboardImages.shop,
      route: '/products',
      icon: ShoppingBag,
      accentColor: 'bg-orange-500',
    },
    {
      id: 5,
      title: 'Market Prices',
      titleTe: 'మార్కెట్ ధరలు',
      image: dashboardImages.market,
      route: '/market-prices',
      icon: TrendingUp,
      accentColor: 'bg-purple-500',
    },
    {
      id: 6,
      title: 'Drone Booking',
      titleTe: 'డ్రోన్ బుకింగ్',
      image: dashboardImages.drone,
      route: '/drone-booking',
      icon: Plane,
      accentColor: 'bg-indigo-500',
    },
  ];

  const getUserInitial = () => {
    return user?.full_name?.charAt(0)?.toUpperCase() || 'F';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Sprout className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">
                  CropSync
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Kiosk
                </p>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right mr-2">
                <p className="text-sm font-medium text-foreground">
                  {user?.full_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Farmer
                </p>
              </div>

              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarImage src={user?.profile_image_url} />
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {getUserInitial()}
                </AvatarFallback>
              </Avatar>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-10 w-10 rounded-full"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in-down">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-telugu">
            స్వాగతం, {user?.full_name}!
          </h2>
          <p className="text-muted-foreground mt-1">
            What would you like to explore today?
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <DashboardCard
                title={feature.title}
                titleTe={feature.titleTe}
                image={feature.image}
                route={feature.route}
                icon={feature.icon}
                accentColor={feature.accentColor}
                onAudioPlay={() => handleAudioPlay(feature.titleTe)}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
