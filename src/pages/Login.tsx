import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingScreen } from '../components/ui/LoadingScreen';

const DEMO_ACCOUNTS = [
  { email: 'coordinator@trinetra.org', role: 'coordinator', displayName: 'Deepak Kumar' }
];

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, signInAs } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auto redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate('/coordinator');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please fill in email field.");
      return;
    }
    
    setError(null);
    signInAs(email);
  };

  const fillDemoAccount = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword('password'); // mock password
    setIsLogin(true);
  };

  if (loading) return <LoadingScreen message="Authenticating..." />;

  return (
    <div className="min-h-screen bg-stone-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_32px_rgba(140,115,85,0.1)] border border-white relative z-10 animate-fade-in-up">
        
        <div className="text-center mb-8">
          <Link to="/" className="inline-block hover:scale-105 transition-transform">
            <img src="/logo.png" alt="TriNetra" className="h-24 mx-auto mb-4 object-contain drop-shadow-xl" />
          </Link>
          <p className="text-on-surface-variant font-medium mt-1">
            Secure Command Center
          </p>
        </div>

        {error && (
          <div className="bg-error-container/50 text-error p-4 rounded-xl mb-6 text-sm font-medium border border-error/20 flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1 ml-1">Full Name</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant/50">person</span>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1 ml-1">Email Address</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant/50">mail</span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1 ml-1">Password</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant/50">lock</span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-on-primary py-4 rounded-2xl font-bold tracking-wide transition-all active:scale-[0.98] shadow-md shadow-primary/20 mt-2"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-on-surface-variant">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="text-primary font-bold hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <div className="mt-8 text-center border-t border-outline-variant/30 pt-6">
          <p className="text-xs text-on-surface-variant mb-3 font-bold uppercase tracking-widest">Quick Login (Mock)</p>
          <div className="flex flex-wrap justify-center gap-2">
            {DEMO_ACCOUNTS.map(acc => (
              <button 
                key={acc.email}
                onClick={() => { fillDemoAccount(acc); signInAs(acc.email); }}
                className="text-[10px] bg-surface-variant hover:bg-surface-variant/80 px-3 py-1.5 rounded-lg text-on-surface-variant transition-colors border border-outline-variant/50"
                title={`${acc.displayName} (${acc.role})`}
              >
                {acc.email}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
