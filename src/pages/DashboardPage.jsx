import React from 'react';
import { useSelector } from 'react-redux';
import AppBar from '@/components/layout/AppBar';
import BottomBar from '@/components/layout/BottomBar';
import DashboardCard from '@/components/layout/DashboardCard';
import { dashboardImages } from '@/lib/images';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

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
      route: '/crop-advisory',
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <AppBar />

      {/* Main Content - Scrollable */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-1"
          >
            <h2 className="text-3xl font-bold tracking-tight">
              Dashboard
            </h2>
            <p className="text-muted-foreground">
              Welcome back to your farming command center.
            </p>
          </motion.div>

          {/* Feature Cards Grid */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <DashboardCard
                key={feature.id}
                index={index}
                title={feature.title}
                titleTe={feature.titleTe}
                image={feature.image}
                route={feature.route}
                borderColor={feature.borderColor}
                onAudioPlay={() => handleAudioPlay(feature.titleTe)}
              />
            ))}
          </motion.div>
        </div>
      </main>

      <BottomBar />
    </div>
  );
};

export default DashboardPage;
