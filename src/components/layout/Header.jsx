import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, toggleLanguage } from '@/store/slices/uiSlice';
import { signOut } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Sun, 
  Moon, 
  Languages, 
  LogOut, 
  Menu,
  Sprout
} from 'lucide-react';

export function Header({ onMenuClick }) {
  const dispatch = useDispatch();
  const { theme, language } = useSelector((state) => state.ui);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const getText = (en, te) => language === 'te' ? te : en;

  const handleSignOut = () => {
    dispatch(signOut());
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sprout className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                {getText('CropSync Kiosk', 'క్రాప్‌సింక్ కియోస్క్')}
              </h1>
              <p className="text-xs text-muted-foreground">
                {getText('Farm Management System', 'వ్యవసాయ నిర్వహణ వ్యవస్థ')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleLanguage())}
            title={getText('Switch to Telugu', 'Switch to English')}
          >
            <Languages className="h-5 w-5" />
            <span className="ml-1 text-xs font-semibold">
              {language === 'en' ? 'తె' : 'EN'}
            </span>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleTheme())}
            title={getText('Toggle theme', 'థీమ్ మార్చండి')}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* User Profile */}
          {isAuthenticated && user && (
            <>
              <div className="hidden md:flex items-center gap-3 ml-2">
                <Avatar>
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium">
                    {user.user_metadata?.full_name || user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getText('Farmer', 'రైతు')}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                title={getText('Sign out', 'సైన్ అవుట్')}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
