import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import NumericKeyboard from '@/components/auth/NumericKeyboard';
import { Sprout, Cloud, TrendingUp, HeadphonesIcon, AlertCircle, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { setUser } from '@/store/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleKeyPress = (key) => {
    if (pin.length < 6) {
      setPin(pin + key);
      setError(null);
    }
  };

  const handleClear = () => {
    setPin('');
    setError(null);
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError(null);
  };

  const handleLogin = async () => {
    if (pin.length !== 6) {
      setError('దయచేసి 6 అంకెల PIN నమోదు చేయండి (Please enter 6-digit PIN)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: farmer, error: dbError } = await supabase
        .from('farmers')
        .select('*')
        .eq('login_pin', pin)
        .single();

      if (dbError || !farmer) {
        setError('చెల్లని PIN. దయచేసి మళ్లీ ప్రయత్నించండి (Invalid PIN. Please try again.)');
        setPin('');
        return;
      }

      dispatch(setUser(farmer));
      navigate('/dashboard');
    } catch (err) {
      setError('లాగిన్ విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి (Login failed. Please try again.)');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background font-poppins">
      {/* Left Panel - Branding & Imagery */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 text-white p-12 flex-col justify-between">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop"
            alt="Agriculture Field"
            className="w-full h-full object-cover grayscale"
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-white rounded-lg">
              <Sprout className="h-6 w-6 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight">CropSync</span>
          </div>

          <h1 className="text-4xl font-medium leading-tight font-telugu max-w-md">
            రైతు సంక్షేమమే <br /> మా ధ్యేయం
          </h1>
        </div>

        <div className="relative z-10 text-sm text-zinc-400">
          © 2024 CropSync Technologies
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground">Enter your PIN to access your account</p>
          </div>

          <div className="space-y-8">
            {/* PIN Display */}
            <div className="space-y-2">
              <div className="flex justify-center gap-4 mb-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${i < pin.length ? 'bg-zinc-900 scale-110' : 'bg-zinc-200'
                      }`}
                  />
                ))}
              </div>

              {/* Hidden Input for accessibility if needed, but we use custom keyboard */}
            </div>

            {/* Error Message */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm justify-center"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-telugu">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Numeric Keyboard */}
            <NumericKeyboard
              onKeyPress={handleKeyPress}
              onClear={handleClear}
              onBackspace={handleBackspace}
              onLogin={handleLogin}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Icon Component
const UserIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default LoginPage;
