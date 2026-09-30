import React, { useState, useEffect } from 'react';
import { Navbar, type NavTab } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { FitnessForm } from './components/FitnessForm.tsx';
import { PlanView } from './components/PlanView.tsx';
import { FeedbackSection } from './components/FeedbackSection.tsx';
import { PlanHistory } from './components/PlanHistory.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { LoadingModal } from './components/LoadingModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import type { UserProfileInput, StoredUserPlan } from './types/fitness.ts';
import { AlertCircle, Dumbbell, ShieldCheck, Heart, Sparkles, UserCheck } from 'lucide-react';

function FitBuddyApp() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [currentRecord, setCurrentRecord] = useState<StoredUserPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMode, setLoadingMode] = useState<'generate' | 'update'>('generate');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // When user logs in or auth token changes, load their personal workout plans
  useEffect(() => {
    const fetchUserPlans = async () => {
      if (user && token) {
        try {
          const res = await fetch('/api/auth/my-plans', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.plans && data.plans.length > 0) {
              setCurrentRecord(data.plans[0]);
              return;
            }
          }
        } catch (err) {
          console.error('Error fetching account plans:', err);
        }
      }

      // Fallback: check localStorage or fetch recent public/demo plan
      const savedId = localStorage.getItem('fitbuddy_last_user_id');
      if (savedId) {
        try {
          const res = await fetch(`/api/users/${savedId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.user) {
              setCurrentRecord(data.user);
              return;
            }
          }
        } catch (err) {
          console.error('Failed to load saved plan:', err);
        }
      }

      // If no saved id, load initial seed user
      try {
        const listRes = await fetch('/api/users');
        if (listRes.ok) {
          const listData = await listRes.json();
          if (listData.success && listData.users && listData.users.length > 0) {
            setCurrentRecord(listData.users[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load initial records:', err);
      }
    };

    fetchUserPlans();
  }, [user, token]);

  const handleGeneratePlan = async (profile: UserProfileInput) => {
    try {
      setIsLoading(true);
      setLoadingMode('generate');
      setErrorMessage(null);

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/generate-workout', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...profile,
          accountUserId: user?.id || profile.accountUserId,
          email: user?.email || profile.email,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate plan. Please try again.');
      }

      setCurrentRecord(data.user);
      localStorage.setItem('fitbuddy_last_user_id', data.user.userId);
      setActiveTab('plan');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Plan generation failed:', err);
      setErrorMessage(
        err.message || 'Something went wrong while generating your plan. Please check your network and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitFeedback = async (feedback: string) => {
    if (!currentRecord) {
      setErrorMessage('Please create a workout plan first.');
      return;
    }

    try {
      setIsLoading(true);
      setLoadingMode('update');
      setErrorMessage(null);

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/submit-feedback', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          userId: currentRecord.userId,
          feedback,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update plan with feedback. Please try again.');
      }

      setCurrentRecord(data.user);
      localStorage.setItem('fitbuddy_last_user_id', data.user.userId);
      setActiveTab('plan');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Plan update failed:', err);
      setErrorMessage(
        err.message || 'Something went wrong while updating your plan. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!currentRecord) return;
    const profile: UserProfileInput = {
      name: currentRecord.name,
      userId: currentRecord.userId,
      age: currentRecord.age,
      weightKg: currentRecord.weightKg,
      goal: currentRecord.goal,
      intensity: currentRecord.intensity,
      experience: currentRecord.experience,
      availableDays: currentRecord.availableDays,
      duration: currentRecord.duration,
      preferences: currentRecord.preferences,
      accountUserId: user?.id || currentRecord.accountUserId,
      email: user?.email || currentRecord.email,
    };
    await handleGeneratePlan(profile);
  };

  const handleSelectUserPlan = (selected: StoredUserPlan) => {
    setCurrentRecord(selected);
    localStorage.setItem('fitbuddy_last_user_id', selected.userId);
    setActiveTab('plan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToForm = () => {
    setActiveTab('home');
    setTimeout(() => {
      const el = document.getElementById('fitness-form-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setErrorMessage(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        hasActivePlan={!!currentRecord}
        hasUpdatedPlan={!!currentRecord?.updatedPlan}
      />

      {/* Global Error Alert Banner */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto px-4 mt-4 w-full no-print">
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-sm flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs uppercase font-bold text-red-400 hover:text-white px-2 py-1 rounded"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Tab Content */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            <Hero onScrollToForm={scrollToForm} />
            <FitnessForm
              onSubmit={handleGeneratePlan}
              isLoading={isLoading}
              initialProfile={currentRecord ? currentRecord.originalPlan.userProfile : null}
            />
          </div>
        )}

        {activeTab === 'plan' && (
          <div>
            {currentRecord ? (
              <PlanView
                plan={currentRecord.updatedPlan || currentRecord.originalPlan}
                isUpdated={!!currentRecord.updatedPlan}
                onGenerateNew={scrollToForm}
                onGoToFeedback={() => setActiveTab('feedback')}
                onRegenerate={handleRegenerate}
              />
            ) : (
              <div className="max-w-md mx-auto px-4 py-20 text-center">
                <Dumbbell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-heading font-bold text-white mb-2">
                  No Active Plan Yet
                </h3>
                <p className="text-sm text-slate-400 mb-6">
                  Fill in your fitness profile on the Home page to generate your custom 7-day plan with Gemini AI.
                </p>
                <button
                  onClick={() => setActiveTab('home')}
                  className="px-6 py-3 rounded-xl font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors"
                >
                  Create Plan Now
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'feedback' && (
          <FeedbackSection
            currentPlan={currentRecord}
            onSubmitFeedback={handleSubmitFeedback}
            isLoading={isLoading}
            onGoToPlan={() => setActiveTab('plan')}
          />
        )}

        {activeTab === 'history' && (
          <PlanHistory
            userRecord={currentRecord}
            onGoToFeedback={() => setActiveTab('feedback')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard onSelectUserPlan={handleSelectUserPlan} />
        )}
      </main>

      {/* Loading Modal Overlay */}
      {isLoading && <LoadingModal mode={loadingMode} />}

      {/* Auth Modal (Login / Signup) */}
      <AuthModal />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060910] py-8 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Dumbbell className="w-4 h-4" />
            </div>
            <span className="font-heading font-black text-slate-300">
              FitBuddy <span className="text-emerald-400">AI</span>
            </span>
            <span className="text-slate-600">|</span>
            <span>Your AI-Powered Personal Fitness Companion</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Safety-First Wellness Logic
            </span>
            <span className="text-slate-700">•</span>
            <span>Secure Account Authentication</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pt-4 border-t border-slate-900 text-center text-[11px] text-slate-600">
          Disclaimer: FitBuddy provides general fitness and wellness information and is not a substitute for professional medical advice. Always consult a healthcare provider before starting any new exercise program.
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FitBuddyApp />
    </AuthProvider>
  );
}
