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
import { motion } from 'framer-motion';



export function Header({ onMenuClick }) {
  const dispatch = useDispatch();
  const { theme, language } = useSelector((state) => state.ui);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const getText = (en, te) => language === 'te' ? te : en;

  const handleSignOut = () => {
    dispatch(signOut());
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 glass shadow-sm">
      <div className="container flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden hover:bg-primary/10"
          >
            <Menu className="h-6 w-6" />
          </Button>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="p-2.5 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg"
            >
              <Sprout className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                {getText('CropSync Kiosk', 'క్రాప్‌సింక్ కియోస్క్')}
              </h1>
              <p className="text-xs font-medium text-muted-foreground tracking-wide">
                {getText('Farm Management System', 'వ్యవసాయ నిర్వహణ వ్యవస్థ')}
              </p>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(toggleLanguage())}
            title={getText('Switch to Telugu', 'Switch to English')}
            className="hidden sm:flex hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <Languages className="h-4 w-4 mr-2" />
            <span className="font-semibold">
              {language === 'en' ? 'తెలుగు' : 'English'}
            </span>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleTheme())}
            title={getText('Toggle theme', 'థీమ్ మార్చండి')}
            className="hover:bg-primary/10 hover:text-primary transition-colors rounded-full"
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
              <div className="hidden md:flex items-center gap-3 ml-2 pl-4 border-l border-border/50">
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-semibold leading-none">
                    {user.user_metadata?.full_name || user.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getText('Farmer', 'రైతు')}
                  </p>
                </div>
                <Avatar className="h-10 w-10 border-2 border-primary/20 ring-2 ring-background">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                title={getText('Sign out', 'సైన్ అవుట్')}
                className="ml-2 hover:bg-destructive/10 hover:text-destructive transition-colors rounded-full"
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
