import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plane, Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Packages', path: '/packages' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Blog', path: '/blog' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
        isScrolled || !isHome
          ? 'bg-white/80 backdrop-blur-md shadow-sm py-4'
          : 'bg-transparent py-6'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className={cn(
              "p-2 rounded-xl transition-colors",
              isScrolled || !isHome ? "bg-primary-600 text-white" : "bg-white text-primary-600"
            )}>
              <Plane className="w-6 h-6 group-hover:-rotate-12 transition-transform" />
            </div>
            <span className={cn(
              "font-heading font-bold text-2xl tracking-tight",
              isScrolled || !isHome ? "text-gray-900" : "text-white"
            )}>
              TripOnBudget
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "font-medium text-sm transition-colors hover:text-primary-500",
                  location.pathname === link.path
                    ? (isScrolled || !isHome ? "text-primary-600" : "text-white font-semibold")
                    : (isScrolled || !isHome ? "text-gray-600" : "text-white/90")
                )}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-4">
                {user.role === 'admin' && (
                  <Link to="/admin" className={cn(
                    "font-medium text-sm transition-colors",
                    isScrolled || !isHome ? "text-primary-600 hover:text-primary-700" : "text-white hover:text-primary-200"
                  )}>
                    Admin Dashboard
                  </Link>
                )}
                <Link to="/dashboard" className={cn(
                  "flex items-center gap-2 font-medium text-sm hover:text-primary-500 transition-colors",
                  isScrolled || !isHome ? "text-gray-700" : "text-white"
                )}>
                  <UserIcon className="w-5 h-5" />
                  <span>{user.name}</span>
                </Link>
                <button 
                  onClick={logout}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    isScrolled || !isHome ? "text-gray-500 hover:bg-gray-100" : "text-white/80 hover:bg-white/20"
                  )}
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/auth" className={cn(
                "px-6 py-2.5 rounded-full font-medium text-sm transition-all hover:scale-105 active:scale-95",
                isScrolled || !isHome
                  ? "bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg"
                  : "bg-white text-primary-600 hover:bg-gray-50"
              )}>
                Login / Sign Up
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={cn("w-6 h-6", isScrolled || !isHome ? "text-gray-900" : "text-white")} />
            ) : (
              <Menu className={cn("w-6 h-6", isScrolled || !isHome ? "text-gray-900" : "text-white")} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100">
          <div className="flex flex-col p-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "font-medium text-base p-2 rounded-lg transition-colors",
                  location.pathname === link.path
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-2 mb-4 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block px-2 py-2 text-primary-600 font-medium hover:bg-primary-50 rounded-lg">
                    Admin Dashboard
                  </Link>
                )}
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full mt-2 px-6 py-3 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 text-center flex items-center justify-center gap-2">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </div>
            ) : (
              <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="w-full mt-4 px-6 py-3 rounded-xl font-medium text-white bg-primary-600 hover:bg-primary-700 text-center block">
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
