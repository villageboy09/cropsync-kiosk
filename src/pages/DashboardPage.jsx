import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dashboardImages } from '@/lib/images';
import { motion } from 'framer-motion';
import { Volume2, LogOut } from 'lucide-react';
import { logout } from '@/store/slices/authSlice';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleAudioPlay = (e, text) => {
    e.stopPropagation();
    // Placeholder for text-to-speech functionality
    console.log('Playing audio:', text);
    // In a real app, you'd use window.speechSynthesis or an API
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'te-IN'; // Telugu
      window.speechSynthesis.speak(utterance);
    }
  };

  const features = [
    {
      id: 1,
      title: 'Weather Updates',
      titleTe: 'వాతావరణం',
      image: dashboardImages.weather,
      route: '/weather',
    },
    {
      id: 2,
      title: 'Crop Advice',
      titleTe: 'పంట సలహాలు',
      image: dashboardImages.cropAdvice,
      route: '/crop-advisory',
    },
    {
      id: 3,
      title: 'Seed Varieties',
      titleTe: 'విత్తన రకాలు',
      image: dashboardImages.seeds,
      route: '/seeds',
    },
    {
      id: 4,
      title: 'Market Prices',
      titleTe: 'మార్కెట్ ధరలు',
      image: dashboardImages.market,
      route: '/market-prices',
    },
    {
      id: 5,
      title: 'Products',
      titleTe: 'ఉత్పత్తులు',
      image: dashboardImages.shop,
      route: '/products',
    },
    {
      id: 6,
      title: 'Drone Booking',
      titleTe: 'డ్రోన్ బుకింగ్',
      image: dashboardImages.drone,
      route: '/drone-booking',
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

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
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
          <div className="w-10 h-10 bg-[#4ade80] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {user?.full_name ? user.full_name[0].toUpperCase() : 'F'}
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 font-medium px-6"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {features.map((feature) => (
            <motion.div key={feature.id} variants={item}>
              <Card
                className="group relative h-[320px] overflow-hidden rounded-[2rem] border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-[#fdfbf7]"
                onClick={() => navigate(feature.route)}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Gradient Overlay for text readability if needed, but design looks clean */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                </div>

                {/* Pill Label (Telugu) */}
                <div className="absolute top-6 left-6">
                  <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
                    <span className="text-[#1a5d2c] font-bold font-telugu text-sm">
                      {feature.titleTe}
                    </span>
                  </div>
                </div>

                {/* English Title (Bottom Left - Optional based on design, design implies image has text) 
                    Since we use generic images, let's add a clean title overlay at the bottom
                */}
                <div className="absolute bottom-6 left-6 right-16">
                  <h3 className="text-white text-2xl font-bold drop-shadow-md leading-tight">
                    {feature.title}
                  </h3>
                </div>

                {/* Speaker Button (Bottom Right) */}
                <button
                  onClick={(e) => handleAudioPlay(e, feature.titleTe)}
                  className="absolute bottom-6 right-6 w-12 h-12 bg-[#4ade80] hover:bg-[#22c55e] rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110 active:scale-95 z-10"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardPage;
