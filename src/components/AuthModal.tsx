import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Dumbbell,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalTab, closeAuthModal, login, signup } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(authModalTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync activeTab when modal opens with a requested tab
  React.useEffect(() => {
    setActiveTab(authModalTab);
    setError(null);
  }, [authModalTab, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (activeTab === 'signup' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (activeTab === 'login') {
        const result = await login(email.trim(), password);
        if (!result.success) {
          setError(result.error || 'Login failed. Please check credentials.');
        }
      } else {
        const result = await signup(name.trim(), email.trim(), password);
        if (!result.success) {
          setError(result.error || 'Signup failed. Please try again.');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await login(demoEmail, 'password123');
      if (!result.success) {
        setError(result.error || 'Demo login failed.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 no-print">
      <div className="relative w-full max-w-md bg-[#0c1322] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Glow ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-gradient-to-b from-emerald-500/20 to-transparent blur-xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 mb-3">
            <Dumbbell className="w-6 h-6 transform -rotate-12" />
          </div>
          <h3 className="text-2xl font-heading font-black text-white">
            {activeTab === 'login' ? 'Welcome Back to FitBuddy' : 'Create Your FitBuddy Account'}
          </h3>
          <p className="text-xs text-slate-400">
            {activeTab === 'login'
              ? 'Sign in to access your personal workout plans and history'
              : 'Join to generate, save, and evolve your personalized fitness blueprints'}
          </p>
        </div>

        {/* Quick Demo Login Cards */}
        <div className="space-y-2">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instant Demo Accounts:</span>
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              type="button"
              onClick={() => handleDemoLogin('alex@fitbuddy.io')}
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/40 text-left flex items-center justify-between text-xs transition-colors group"
            >
              <div>
                <span className="font-bold text-white group-hover:text-emerald-300">
                  Alex Rivera
                </span>
                <span className="text-[11px] text-slate-400 ml-2">
                  (Muscle Gain • 5-Day)
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                1-Click
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('sarah@fitbuddy.io')}
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/40 text-left flex items-center justify-between text-xs transition-colors group"
            >
              <div>
                <span className="font-bold text-white group-hover:text-amber-300">
                  Sarah Chen
                </span>
                <span className="text-[11px] text-slate-400 ml-2">
                  (Weight Loss & Yoga • 4-Day)
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                1-Click
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('marcus@fitbuddy.io')}
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 text-left flex items-center justify-between text-xs transition-colors group"
            >
              <div>
                <span className="font-bold text-white group-hover:text-cyan-300">
                  Marcus Johnson
                </span>
                <span className="text-[11px] text-slate-400 ml-2">
                  (General Wellness • 4-Day)
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
                1-Click
              </span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full"></div>
          <span className="bg-[#0c1322] px-3 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
            Or Use Email
          </span>
        </div>

        {/* Tab Toggle: Log In / Sign Up */}
        <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'login'
                ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'signup'
                ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'signup' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Miller"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            {activeTab === 'signup' && (
              <span className="text-[11px] text-slate-500 mt-1 block">
                At least 6 characters
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl font-heading font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-all ${
              isSubmitting
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 hover:from-emerald-300 hover:to-cyan-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 cursor-pointer'
            }`}
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-slate-400 border-t-emerald-400 rounded-full animate-spin"></div>
            ) : (
              <>
                <span>{activeTab === 'login' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
