import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { LoadingScreen } from '../components/ui/LoadingScreen';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate('/role-selection');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <LoadingScreen message="Checking authorization..." />;
  }

  const handleGoogleSignIn = async () => {
    try {
      setAuthLoading(true);
      setError(null);
      await signInWithPopup(auth, googleProvider);
      navigate('/role-selection');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in with Google');
      setAuthLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setAuthLoading(true);
      setError(null);
      
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/role-selection');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed');
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-bg flex flex-col items-center justify-center p-margin-mobile relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-tri-saffron via-transparent to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-tri-green via-transparent to-transparent"></div>

      <div className="w-full max-w-md z-10 animate-fade-in flex flex-col items-center bg-surface p-8 rounded-3xl shadow-lg border border-outline-variant">
        
        {/* App Logo */}
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-md">
          <span className="material-symbols-outlined text-white text-3xl">visibility</span>
        </div>
        
        <h1 className="font-headline-lg text-on-surface mb-2 tracking-tight text-center">
          triNETRA
        </h1>
        <p className="font-body-md text-on-surface-variant mb-8 text-center">
          Commanded Serenity. Sign in to continue.
        </p>

        {error && (
          <div className="w-full bg-error-container text-on-error-container p-4 rounded-lg mb-6 text-sm font-medium animate-fade-in flex items-start gap-3">
            <span className="material-symbols-outlined text-error">error</span>
            <p className="flex-1">{error}</p>
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleEmailAuth} className="w-full space-y-4 mb-6">
          <Input 
            type="email" 
            label="Email Address" 
            placeholder="coordinator@trinetra.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={authLoading}
            required
            className="w-full"
          />
          <Input 
            type="password" 
            label="Password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={authLoading}
            required
            className="w-full"
          />
          
          <Button 
            type="submit" 
            disabled={authLoading} 
            className="w-full py-4 text-lg font-bold tracking-wide mt-2 flex items-center justify-center gap-2"
          >
            {authLoading ? (
              <span className="material-symbols-outlined animate-spin">refresh</span>
            ) : isLoginMode ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="w-full flex items-center gap-4 mb-6">
          <div className="h-px bg-outline-variant flex-1"></div>
          <span className="text-on-surface-variant font-label-sm uppercase tracking-wider text-xs">OR</span>
          <div className="h-px bg-outline-variant flex-1"></div>
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={authLoading}
          className="w-full flex items-center justify-center gap-3 p-4 bg-surface-container hover:bg-surface-container-high border border-outline-variant rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
          <span className="font-label-sm text-on-surface font-semibold">Continue with Google</span>
        </button>

        {/* Toggle Mode */}
        <button 
          type="button"
          onClick={() => setIsLoginMode(!isLoginMode)}
          className="mt-8 text-primary hover:text-primary-fixed transition-colors font-label-sm text-sm"
        >
          {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
};
