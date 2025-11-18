import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import NumericKeyboard from '@/components/auth/NumericKeyboard';
import { Sprout, Cloud, TrendingUp, Headphones, Leaf } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { setUser } from '@/store/slices/authSlice';

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
    { icon: Leaf, labelTe: 'పంట సలహాలు', labelEn: 'Crop Advice' },
    { icon: Cloud, labelTe: 'వాతావరణం', labelEn: 'Weather' },
    { icon: TrendingUp, labelTe: 'మార్కెట్ ధరలు', labelEn: 'Market Prices' },
    { icon: Headphones, labelTe: '24/7 మద్దతు', labelEn: 'Support' },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary p-12 flex-col justify-center items-center text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-md space-y-8 animate-fade-in">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Sprout className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">CropSync</h1>
              <p className="text-sm opacity-80">Kiosk</p>
            </div>
          </div>

          {/* Tagline */}
          <div className="space-y-2">
            <p className="text-2xl font-telugu font-medium">
              మీ స్మార్ట్ వ్యవసాయ సహాచరుడు
            </p>
            <p className="text-lg opacity-90">
              Your Smart Agriculture Companion
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 mt-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <feature.icon className="h-4 w-4" />
                <div>
                  <p className="font-telugu text-xs">{feature.labelTe}</p>
                  <p className="text-[10px] opacity-70">{feature.labelEn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Sprout className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-primary">CropSync</h1>
          </div>

          {/* Welcome Text */}
          <div className="text-center space-y-1">
            <h2 className="text-3xl font-bold text-foreground font-telugu">
              స్వాగతం!
            </h2>
            <p className="text-lg text-muted-foreground">Welcome back</p>
          </div>

          {/* Login Card */}
          <Card className="border-0 shadow-premium-lg">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-center text-lg">
                <span className="font-telugu">రైతు లాగిన్</span>
              </CardTitle>
              <CardDescription className="text-center">
                Enter your 6-digit PIN to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* PIN Display */}
              <div className="relative">
                <div className="flex justify-center gap-2 mb-2">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-10 h-12 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                        i < pin.length
                          ? 'bg-primary/10 border-primary'
                          : 'bg-secondary border-border'
                      }`}
                    >
                      {i < pin.length && (
                        <div className="w-3 h-3 rounded-full bg-primary animate-scale-in" />
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  {pin.length}/6 digits
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <Alert variant="destructive" className="animate-fade-in">
                  <AlertDescription className="font-telugu text-center text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Numeric Keyboard */}
              <NumericKeyboard
                onKeyPress={handleKeyPress}
                onClear={handleClear}
                onBackspace={handleBackspace}
                onLogin={handleLogin}
                disabled={loading}
              />
            </CardContent>
          </Card>

          {/* Help Text */}
          <div className="text-center space-y-1">
            <p className="text-xs text-muted-foreground font-telugu">
              మీ PIN మర్చిపోయారా? సహాయ కేంద్రాన్ని సంప్రదించండి
            </p>
            <p className="text-xs text-muted-foreground">
              Forgot PIN? Contact help center
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
