import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signIn, clearError, setUser } from '@/store/slices/authSlice';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout, User, AlertCircle } from 'lucide-react';

export function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const { language } = useSelector((state) => state.ui);
  
  const [userId, setUserId] = useState('');
  const [localError, setLocalError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getText = (en, te) => language === 'te' ? te : en;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError(null);
    
    if (!userId.trim()) {
      setLocalError(getText('Please enter your User ID', 'దయచేసి మీ యూజర్ ఐడిని నమోదు చేయండి'));
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authApi.login(userId.trim());
      
      if (response.success && response.user) {
        authApi.storeUser(response.user);
        dispatch(setUser(response.user));
        navigate('/dashboard');
      } else {
        setLocalError(response.message || getText('Invalid User ID', 'చెల్లని యూజర్ ఐడి'));
      }
    } catch (err) {
      setLocalError(getText('Login failed. Please try again.', 'లాగిన్ విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.'));
    } finally {
      setIsLoading(false);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-2xl">
              <Sprout className="h-16 w-16 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl">
            {getText('CropSync Kiosk', 'క్రాప్‌సింక్ కియోస్క్')}
          </CardTitle>
          <CardDescription>
            {getText('Farm Management System', 'వ్యవసాయ నిర్వహణ వ్యవస్థ')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-id">
                {getText('User ID', 'యూజర్ ఐడి')}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="user-id"
                  type="text"
                  placeholder={getText('Enter your User ID', 'మీ యూజర్ ఐడి నమోదు చేయండి')}
                  className="pl-10"
                  value={userId}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    setLocalError(null);
                  }}
                  required
                />
              </div>
            </div>

            {displayError && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm">{displayError}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading || isLoading}>
              {(loading || isLoading) 
                ? getText('Signing in...', 'సైన్ ఇన్ అవుతోంది...') 
                : getText('Sign In', 'సైన్ ఇన్')}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center text-sm text-muted-foreground">
          {getText(
            'Secure authentication powered by MySQL',
            'MySQL ద్వారా సురక్షిత ప్రమాణీకరణ'
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
