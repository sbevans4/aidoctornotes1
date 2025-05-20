
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { useAuth } from '@/contexts/AuthContext';
import { Session } from '@supabase/supabase-js';

export interface DesktopNavigationProps {
  textColor: string;
  buttonVariant: string;
  session: Session | null;
  handleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  textColor,
  buttonVariant,
  session,
  handleLogin,
  handleLogout
}) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, user, signOut } = useAuth();
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const primaryLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Enterprise', path: '/enterprise' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' }
  ];

  const authenticatedLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Documentation', path: '/medical-documentation' },
    { name: 'Referrals', path: '/referrals' },
    { name: 'Profile', path: '/profile' }
  ];

  // Check if user is admin
  const isAdmin = user?.user_metadata?.is_admin || false;

  return (
    <header className="border-b border-gray-200 bg-white px-4 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Logo textColor={textColor} />
          
          <nav className="ml-8 hidden space-x-1 lg:flex">
            {/* Primary Navigation Links */}
            {primaryLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive(link.path)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center space-x-2">
          {isLoading ? (
            <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse" />
          ) : isAuthenticated ? (
            // Authenticated state
            <div className="flex items-center space-x-2">
              <nav className="hidden space-x-1 lg:flex">
                {authenticatedLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive(link.path)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                
                {isAdmin && (
                  <Link
                    to="/admin/referrals"
                    className={cn(
                      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive('/admin/referrals')
                        ? 'bg-amber-50 text-amber-700'
                        : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'
                    )}
                  >
                    Admin Panel
                  </Link>
                )}
              </nav>
              
              <Button
                onClick={signOut}
                variant={buttonVariant as any}
                size="sm"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            // Unauthenticated state
            <>
              <Link to="/auth">
                <Button
                  variant={buttonVariant as any}
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/auth?signup=true">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
