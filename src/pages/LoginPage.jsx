import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import NumericKeyboard from '@/components/auth/NumericKeyboard';
import { Sprout, Cloud, TrendingUp, HeadphonesIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { setUser } from '@/store/slices/authSlice';
import { motion } from 'framer-motion';

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

  const features = [
    { icon: Sprout, te: 'పంట సలహాలు', en: 'Crop Advice' },
    { icon: Cloud, te: 'వాతావరణం', en: 'Weather' },
    { icon: TrendingUp, te: 'మార్కెట్ ధరలు', en: 'Market Prices' },
    { icon: HeadphonesIcon, te: '24/7 మద్దతు', en: '24/7 Support' },
  ];

  return (
    <div className="min-h-screen flex overflow-hidden bg-background">
      {/* Left Panel - Branding */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden p-12 flex-col justify-center items-center text-white"
      >
        {/* Background Gradient & Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 z-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay z-0" />

        <div className="max-w-md space-y-10 relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center space-x-4"
          >
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-xl">
              <Sprout className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold font-poppins tracking-tight">CropSync</h1>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-2xl font-telugu font-medium mb-2">
              మీ స్మార్ట్ వ్యవసాయ సహాచరుడు
            </p>
            <p className="text-lg font-poppins opacity-90 font-light tracking-wide">
              Your Smart Agriculture Companion
            </p>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-colors duration-300">
                  <CardContent className="p-5 text-center">
                    <feature.icon className="h-8 w-8 mx-auto mb-3 text-white" />
                    <p className="font-telugu text-base font-medium text-white">{feature.te}</p>
                    <p className="font-poppins text-xs opacity-80 text-white/90">{feature.en}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md space-y-8 relative z-10"
        >
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold text-gradient font-telugu">
              స్వాగతం!
            </h2>
            <p className="text-xl font-poppins text-muted-foreground">Welcome!</p>
          </div>

          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl ring-1 ring-black/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-center font-telugu text-2xl text-primary">రైతు లాగిన్</CardTitle>
              <CardDescription className="text-center font-poppins text-sm">
                Farmer Login
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              <div className="space-y-2 text-center">
                <p className="text-sm text-muted-foreground font-telugu">
                  దయచేసి మీ 6 అంకెల PIN నమోదు చేయండి
                </p>
                <p className="text-xs text-muted-foreground/80 font-poppins">
                  Please enter your 6-digit PIN
                </p>
              </div>

              {/* PIN Display */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <Input
                  type="password"
                  value={pin}
                  readOnly
                  placeholder="••••••"
                  className="relative text-center text-4xl tracking-[0.5em] h-20 font-bold bg-white border-border/50 shadow-inner focus-visible:ring-primary/50"
                  maxLength={6}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-poppins font-medium bg-gray-100 px-2 py-1 rounded">
                  {pin.length}/6
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Alert variant="destructive" className="bg-destructive/5 border-destructive/20">
                    <AlertDescription className="font-telugu text-center font-medium text-destructive">
                      {error}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {/* Numeric Keyboard */}
              <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                <NumericKeyboard
                  onKeyPress={handleKeyPress}
                  onClear={handleClear}
                  onBackspace={handleBackspace}
                  onLogin={handleLogin}
                  disabled={loading}
                />
              </div>

              {/* Help Text */}
              <div className="text-center space-y-1">
                <p className="text-xs text-muted-foreground font-telugu hover:text-primary transition-colors cursor-pointer">
                  మీ PIN మర్చిపోయారా? దయచేసి సహాయ కేంద్రాన్ని సంప్రదించండి
                </p>
                <p className="text-[10px] text-muted-foreground/70 font-poppins">
                  Forgot your PIN? Please contact the help center
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
