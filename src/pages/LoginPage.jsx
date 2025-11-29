import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Delete, Sprout, CloudSun, TrendingUp, Headphones, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { setUser } from '@/store/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
  const [inputId, setInputId] = useState('');
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
    if (inputId.length < 10) {
      setInputId(prev => prev + key);
      setError(null);
    }
  };

  const handleClear = () => {
    setInputId('');
    setError(null);
  };

  const handleBackspace = () => {
    setInputId(prev => prev.slice(0, -1));
    setError(null);
  };

  const handleLogin = async () => {
    console.log('Attempting login with:', inputId);
    if (inputId.length === 0) {
      setError('దయచేసి మీ పిన్ నంబర్‌ను నమోదు చేయండి (Please enter your PIN)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if input is purely numeric
      const isNumeric = /^\d+$/.test(inputId);
      console.log('Is numeric:', isNumeric);

      if (!isNumeric) {
        setError('దయచేసి సరైన పిన్ నంబర్‌ను నమోదు చేయండి (Please enter a valid numeric PIN)');
        setLoading(false);
        return;
      }

      // Query specifically for login_pin based on the provided schema
      const { data: farmer, error: dbError } = await supabase
        .from('farmers')
        .select('*')
        .eq('login_pin', inputId)
        .single();

      if (dbError) {
        console.error('DB Error:', dbError);
        // Handle specific error codes if needed, e.g., PGRST116 (0 rows)
        if (dbError.code !== 'PGRST116') {
          console.error('Unexpected DB Error:', dbError.message);
        }
      }

      if (farmer) console.log('Farmer found:', farmer);

      if (dbError || !farmer) {
        setError('చెల్లని పిన్. దయచేసి మళ్లీ ప్రయత్నించండి (Invalid PIN. Please try again.)');
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

  const FeatureCard = ({ icon: Icon, label }) => (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-center hover:bg-white/20 transition-colors">
      <Icon className="h-6 w-6 text-yellow-400" />
      <span className="text-white text-xs font-medium">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-poppins">
      <Card className="w-full max-w-5xl h-[600px] flex overflow-hidden shadow-2xl rounded-3xl border-0">

        {/* Left Panel - Green */}
        <div className="w-1/2 bg-[#1a5d2c] p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-[#1a5d2c]">C</span>
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Carbon Mint</h1>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4 font-telugu leading-relaxed">
              మీ స్మార్ట్ వ్యవసాయ సహచరుడు
            </h2>
            <p className="text-green-100/80 text-sm mb-8 leading-relaxed">
              పంటలు, వాతావరణం మరియు మార్కెట్ ధరల వివరాలు... <br /> అన్నీ ఒక్కచోట!
            </p>

            <div className="grid grid-cols-2 gap-4">
              <FeatureCard icon={Sprout} label="పంట సలహాలు" />
              <FeatureCard icon={CloudSun} label="వాతావరణం" />
              <FeatureCard icon={TrendingUp} label="మార్కెట్ ధరలు" />
              <FeatureCard icon={Headphones} label="24/7 మద్దతు" />
            </div>
          </div>
        </div>

        {/* Right Panel - White */}
        <div className="w-1/2 bg-white p-12 flex flex-col items-center justify-center relative">
          <div className="w-full max-w-sm space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-[#1a5d2c] font-telugu">స్వాగతం!</h2>
              <p className="text-sm text-gray-500 font-telugu">కొనసాగడానికి మీ రైతు ఐడిని నమోదు చేయండి</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 font-telugu block text-center">రైతు ఐడి</label>
              <div className="relative">
                <Input
                  value={inputId}
                  readOnly
                  className="text-center text-xl font-bold h-12 border-gray-200 bg-gray-50 focus-visible:ring-[#1a5d2c] text-gray-900"
                  placeholder="రైతు ఐడి నమోదు"
                />
              </div>
            </div>

            {/* Custom Keypad */}
            <div className="space-y-2">
              {/* Letters Row - 4 items */}
              <div className="grid grid-cols-4 gap-2">
                {['T', 'G', 'F', 'M'].map((key) => (
                  <Button key={key} onClick={() => handleKeyPress(key)} variant="secondary" className="h-12 text-lg font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-sm">{key}</Button>
                ))}
              </div>

              {/* Numbers Rows - 5 items per row */}
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <Button key={num} onClick={() => handleKeyPress(num.toString())} variant="secondary" className="h-12 text-lg font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-sm">{num}</Button>
                ))}
                {[6, 7, 8, 9, 0].map((num) => (
                  <Button key={num} onClick={() => handleKeyPress(num.toString())} variant="secondary" className="h-12 text-lg font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-sm">{num}</Button>
                ))}
              </div>

              {/* Actions Row */}
              <div className="grid grid-cols-5 gap-2">
                <Button
                  onClick={handleClear}
                  className="col-span-3 h-12 bg-orange-300 hover:bg-orange-400 text-orange-900 font-bold font-telugu text-lg shadow-sm"
                >
                  తొలగించు
                </Button>
                <Button
                  onClick={handleBackspace}
                  className="col-span-2 h-12 bg-red-200 hover:bg-red-300 text-red-900 shadow-sm"
                >
                  <Delete className="h-6 w-6" />
                </Button>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              className="w-full h-12 bg-[#3a9e53] hover:bg-[#2f8244] text-white font-bold text-lg shadow-md font-telugu"
              disabled={loading}
            >
              {loading ? 'ప్రాసెస్ చేస్తోంది...' : 'లాగిన్'}
            </Button>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-center justify-center gap-2 text-red-600 text-sm font-medium mt-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
