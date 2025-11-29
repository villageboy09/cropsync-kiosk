import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const AppBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="h-20 px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-50 bg-white/30 backdrop-blur-md border-b border-white/20 shadow-sm rounded-b-3xl mx-4 mt-2"
    >
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <span className="text-2xl">🌱</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">CropSync</h1>
          <p className="text-xs text-muted-foreground font-medium">Kiosk Edition</p>
        </div>
      </div>

      {/* Right Section - Dashboard Button */}
      {!isDashboard && (
        <Button
          onClick={() => navigate('/dashboard')}
          className="bg-white/50 hover:bg-white/80 text-foreground border-0 shadow-sm backdrop-blur-sm gap-2 rounded-xl h-10 px-4 transition-all duration-300 hover:scale-105"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span className="font-medium">Dashboard</span>
        </Button>
      )}
    </motion.header>
  );
};

export default AppBar;
