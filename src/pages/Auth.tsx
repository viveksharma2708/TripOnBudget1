import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const [view, setView] = useState<'login' | 'signup' | 'forgot-password'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, resetPassword, logout, loginWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);
    try {
      const result = await loginWithGoogle();
      if (result.success) {
        setSuccessMsg('Signed in with Google! Redirecting...');
        const returnTo = location.state?.returnTo || '/';
        navigate(returnTo);
      } else {
        // Handle specific Firebase error codes or friendly messages
        if (result.error?.includes('popup-closed-by-user')) {
          setError('The sign-in popup was closed too early. Please ensure you are not using "Private/Incognito" mode and disable any AdBlockers for this site.');
        } else if (result.error?.includes('cancelled-by-user')) {
          setError('Sign-in was cancelled. Please try again.');
        } else {
          setError(result.error || 'Failed to sign in with Google');
        }
      }
    } catch (err: any) {
      console.error('Google Login component error:', err);
      setError('An error occurred during Google sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);
    
    try {
      if (view === 'login') {
        const result = await login(email, password);
        if (!result.success) {
          setError(result.error || 'Invalid credentials. Please check your email and password.');
          setIsSubmitting(false);
          return;
        }
        
        const returnTo = location.state?.returnTo || '/';
        
        // Let the useEffect in App or AuthContext handle the role check, or do it here properly
        // But for now, let's just use the result data if it's available or wait for session.
        // Actually the 'login' function does fetchProfile.
        
        setIsSubmitting(false);
        setSuccessMsg('Login successful! Redirecting...');
        navigate(returnTo);
        // Fallback for navigation hanging
        setTimeout(() => {
          if (window.location.pathname === '/auth') {
             window.location.href = returnTo;
          }
        }, 500);
        
      } else if (view === 'signup') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setError('Please enter a valid email address.');
          setIsSubmitting(false);
          return;
        }
        
        const result = await signup(email, name, password);
        if (!result.success) {
          setError(result.error || 'Email already exists or invalid password');
          setIsSubmitting(false);
          return;
        }
        
        if (result.requiresEmail) {
          setSuccessMsg('Account created successfully! Please check your inbox to confirm your email.');
          setEmail('');
          setPassword('');
          setName('');
          setIsSubmitting(false);
        } else {
          setSuccessMsg('Account created successfully! Redirecting...');
          const returnTo = location.state?.returnTo || '/';
          navigate(returnTo);
          // Fallback for navigation hanging
          setTimeout(() => {
            if (window.location.pathname === '/auth') {
               window.location.href = returnTo;
            }
          }, 500);
        }
      } else if (view === 'forgot-password') {
        const success = await resetPassword(email);
        if (!success) {
          setError('Failed to send reset email. Please check the email address.');
          setIsSubmitting(false);
          return;
        }
        setSuccessMsg('Password reset link sent! Please check your email inbox.');
        setIsSubmitting(false);
      }
    } catch (err) {
       console.error("Auth form submission crash", err);
       setError("A fatal error occurred. Please refresh the page.");
       setIsSubmitting(false);
    }
  };

  const renderHeader = () => {
    switch (view) {
      case 'login':
        return { title: 'Welcome Back', subtitle: 'Sign in to access your bookings and saved trips.' };
      case 'signup':
        return { title: 'Create Account', subtitle: 'Join us to start planning your next adventure.' };
      case 'forgot-password':
        return { title: 'Reset Password', subtitle: 'Enter your email to receive a password reset link.' };
    }
    return { title: '', subtitle: '' };
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
            {(view === 'forgot-password') && (
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

            <div className="space-y-4 mb-8">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <img 
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                  alt="Google" 
                  className="w-5 h-5"
                />
                Continue with verified Google Account
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 font-medium italic">or use verified email</span>
                </div>
              </div>
            </div>

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
                disabled={isSubmitting}
                className={`w-full bg-primary-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-primary-700 transition-colors shadow-md flex items-center justify-center gap-2 group ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Please wait...
                  </>
                ) : (
                  <>
                    {view === 'login' ? 'Sign In' : 
                     view === 'signup' ? 'Create Account' : 
                     'Send Reset Link'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {(view === 'login' || view === 'signup') && (
              <div className="mt-8 text-center">
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
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
