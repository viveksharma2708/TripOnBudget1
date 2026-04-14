import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const [view, setView] = useState<'login' | 'signup' | 'forgot-password' | 'reset-password'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, resetPassword, allUsers } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    let success = false;
    if (view === 'login') {
      success = login(email, password);
      if (!success) {
        setError('Invalid email or password');
        return;
      }
      
      const loggedInUser = allUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      const returnTo = location.state?.returnTo || '/';
      
      if (returnTo === '/admin' && loggedInUser?.role !== 'admin') {
        setError('Access denied: Admin role required to access this route.');
        logout();
        return;
      }
      
      navigate(returnTo);
    } else if (view === 'signup') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address.');
        return;
      }
      
      success = signup(email, name, password);
      if (!success) {
        setError('Email already exists');
        return;
      }
      const returnTo = location.state?.returnTo || '/';
      navigate(returnTo);
    } else if (view === 'forgot-password') {
      const existingUser = allUsers.find(u => u.email === email);
      if (!existingUser) {
        setError('No account found with that email address');
        return;
      }
      // Proceed to reset password view
      setView('reset-password');
    } else if (view === 'reset-password') {
      success = resetPassword(email, newPassword);
      if (!success) {
        setError('Failed to reset password');
        return;
      }
      setSuccessMsg('Password reset successfully. You can now sign in.');
      setView('login');
      setPassword('');
      setNewPassword('');
    }
  };

  const renderHeader = () => {
    switch (view) {
      case 'login':
        return { title: 'Welcome Back', subtitle: 'Sign in to access your bookings and saved trips.' };
      case 'signup':
        return { title: 'Create Account', subtitle: 'Join us to start planning your next adventure.' };
      case 'forgot-password':
        return { title: 'Reset Password', subtitle: 'Enter your email to reset your password.' };
      case 'reset-password':
        return { title: 'Set New Password', subtitle: 'Enter your new password below.' };
    }
  };

  const header = renderHeader();

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="p-8 sm:p-12">
            {(view === 'forgot-password' || view === 'reset-password') && (
              <button 
                onClick={() => {
                  setView('login');
                  setError('');
                  setSuccessMsg('');
                }}
                className="mb-6 flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to login
              </button>
            )}

            <div className="text-center mb-8">
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">
                {header.title}
              </h2>
              <p className="text-gray-500">
                {header.subtitle}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center">
                {error}
              </div>
            )}
            
            {successMsg && (
              <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl text-sm text-center">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {view === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      placeholder="John Doe"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {(view === 'login' || view === 'signup' || view === 'forgot-password') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled={view === 'reset-password'}
                    />
                  </div>
                </div>
              )}

              {(view === 'login' || view === 'signup') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {view === 'reset-password' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {view === 'login' && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <button 
                      type="button" 
                      onClick={() => {
                        setView('forgot-password');
                        setError('');
                        setSuccessMsg('');
                      }} 
                      className="font-medium text-primary-600 hover:text-primary-500"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-primary-700 transition-colors shadow-md flex items-center justify-center gap-2 group"
              >
                {view === 'login' ? 'Sign In' : 
                 view === 'signup' ? 'Create Account' : 
                 view === 'forgot-password' ? 'Continue' : 'Save New Password'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {(view === 'login' || view === 'signup') && (
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      // Mock Google Auth
                      const mockGoogleEmail = "user@gmail.com";
                      const mockGoogleName = "Google User";
                      if (view === 'login') {
                        if (!login(mockGoogleEmail, 'google_oauth_mock')) {
                          signup(mockGoogleEmail, mockGoogleName, 'google_oauth_mock');
                        }
                      } else {
                        signup(mockGoogleEmail, mockGoogleName, 'google_oauth_mock');
                      }
                      navigate(location.state?.returnTo || '/');
                    }}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Sign in with Google
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    {view === 'login' ? "Don't have an account? " : "Already have an account? "}
                    <button
                      onClick={() => {
                        setView(view === 'login' ? 'signup' : 'login');
                        setError('');
                        setSuccessMsg('');
                        setPassword('');
                      }}
                      className="font-bold text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      {view === 'login' ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
