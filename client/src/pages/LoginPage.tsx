import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  
  const { login, loginWithGoogle, forgotPassword, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (forgotPasswordMode) {
      if (!email) {
        toast.error('Please enter your email address');
        return;
      }
      
      setIsLoading(true);
      const { error } = await forgotPassword(email);
      
      if (error) {
        toast.error('Failed to send reset email. Please try again.');
      } else {
        toast.success('Password reset email sent!');
        setForgotPasswordMode(false);
      }
      setIsLoading(false);
      return;
    }

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const { error } = await login(email, password);
    
    if (error) {
      if (error.message?.includes('Invalid login credentials')) {
        toast.error('Invalid email or password');
      } else if (error.message?.includes('Email not confirmed')) {
        toast.error('Please check your email and click the confirmation link');
      } else {
        toast.error(error.message || 'Login failed');
      }
    } else {
      toast.success('Welcome back!');
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await loginWithGoogle();
    
    if (error) {
      toast.error(error.message || 'Google sign-in failed');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-purple-500/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {forgotPasswordMode ? 'Reset Password' : 'Welcome back'}
            </h1>
            <p className="text-gray-300">
              {forgotPasswordMode 
                ? 'Enter your email to receive reset instructions'
                : 'Sign in to your RootPilot account'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>

            {!forgotPasswordMode && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}

            {!forgotPasswordMode && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setForgotPasswordMode(true)}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                forgotPasswordMode ? 'Send Reset Email' : 'Sign in'
              )}
            </button>

            {forgotPasswordMode ? (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setForgotPasswordMode(false)}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  Back to sign in
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-800 text-gray-400">OR CONTINUE WITH</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                <div className="text-center">
                  <span className="text-gray-400">Don't have an account? </span>
                  <Link
                    to="/signup"
                    className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}