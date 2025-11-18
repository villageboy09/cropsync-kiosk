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
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-green-800 p-12 flex-col justify-center items-center text-white">
        <div className="max-w-md space-y-8">
          <div className="flex items-center space-x-3">
            <Sprout className="h-12 w-12" />
            <h1 className="text-4xl font-bold font-poppins">CropSync</h1>
          </div>
          
          <p className="text-xl font-telugu">
            మీ స్మార్ట్ వ్యవసాయ సహాచరుడు
          </p>
          <p className="text-lg font-poppins opacity-90">
            Your Smart Agriculture Companion
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-4 text-center">
                <Sprout className="h-8 w-8 mx-auto mb-2" />
                <p className="font-telugu text-sm">పంట సలహాలు</p>
                <p className="font-poppins text-xs opacity-80">Crop Advice</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-4 text-center">
                <Cloud className="h-8 w-8 mx-auto mb-2" />
                <p className="font-telugu text-sm">వాతావరణం</p>
                <p className="font-poppins text-xs opacity-80">Weather</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                <p className="font-telugu text-sm">మార్కెట్ ధరలు</p>
                <p className="font-poppins text-xs opacity-80">Market Prices</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-4 text-center">
                <HeadphonesIcon className="h-8 w-8 mx-auto mb-2" />
                <p className="font-telugu text-sm">24/7 మద్దతు</p>
                <p className="font-poppins text-xs opacity-80">24/7 Support</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 font-telugu mb-2">
              స్వాగతం!
            </h2>
            <p className="text-xl font-poppins text-gray-600 mb-1">Welcome!</p>
            <p className="text-sm text-gray-500 font-telugu mt-4">
              దయచేసి మీ 6 అంకెల PIN నమోదు చేయండి
            </p>
            <p className="text-xs text-gray-500 font-poppins">
              Please enter your 6-digit PIN
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center font-telugu">రైతు లాగిన్</CardTitle>
              <CardDescription className="text-center font-poppins">
                Farmer Login
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* PIN Display */}
              <div className="relative">
                <Input
                  type="password"
                  value={pin}
                  readOnly
                  placeholder="••••••"
                  className="text-center text-3xl tracking-widest h-16 font-bold"
                  maxLength={6}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-poppins">
                  {pin.length}/6
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="font-telugu text-center">
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

              {/* Help Text */}
              <p className="text-xs text-center text-gray-500 font-telugu">
                మీ PIN మర్చిపోయారా? దయచేసి సహాయ కేంద్రాన్ని సంప్రదించండి
              </p>
              <p className="text-xs text-center text-gray-500 font-poppins">
                Forgot your PIN? Please contact the help center
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
