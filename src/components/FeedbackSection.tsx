import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Zap,
  ArrowRight,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import type { StoredUserPlan } from '../types/fitness.ts';

interface FeedbackSectionProps {
  currentPlan: StoredUserPlan | null;
  onSubmitFeedback: (feedback: string) => void;
  isLoading: boolean;
  onGoToPlan: () => void;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  currentPlan,
  onSubmitFeedback,
  isLoading,
  onGoToPlan,
}) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [error, setError] = useState('');

  const quickIdeas = [
    'Add a 15-minute restorative yoga session on rest days',
    'Include more cardio & calorie burn intervals',
    'Reduce workout intensity; make it gentler on knees and lower back',
    'Add more core & oblique stability exercises',
    'Swap heavy weights for bodyweight and resistance bands',
    'Include 2 complete rest days instead of 1',
  ];

  const handleQuickAdd = (idea: string) => {
    if (!feedbackText.trim()) {
      setFeedbackText(idea);
    } else {
      setFeedbackText((prev) => `${prev}. Also, ${idea.toLowerCase()}`);
    }
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPlan) {
      setError('Please generate a workout plan first before submitting feedback.');
      return;
    }
    if (!feedbackText.trim() || feedbackText.trim().length < 4) {
      setError('Please describe how you would like to modify or improve your workout plan.');
      return;
    }

    setError('');
    onSubmitFeedback(feedbackText.trim());
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 no-print">
      <div className="bg-[#0f172a]/95 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl relative">
        {/* Glow accent */}
        <div className="absolute top-0 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>

        {/* Section Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
              Improve My Plan
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Provide feedback or custom requests. Gemini AI will adapt your 7-day plan while keeping your original blueprint safely stored.
            </p>
          </div>
        </div>

        {/* Current Plan Summary Card */}
        {currentPlan ? (
          <div className="mb-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Target Plan:
                </span>
                <span className="text-sm font-bold text-white">{currentPlan.name}</span>
                <span className="text-xs font-mono text-cyan-400 bg-slate-800 px-2 py-0.5 rounded">
                  {currentPlan.userId}
                </span>
                {currentPlan.status === 'updated' && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-bold border border-violet-500/30">
                    Previously Updated
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
                <span>🎯 {currentPlan.goal}</span>
                <span>⚡ {currentPlan.intensity} Intensity</span>
                <span>⏱️ {currentPlan.duration}</span>
                <span>📅 {currentPlan.availableDays} Days/wk</span>
              </div>
            </div>

            <button
              onClick={onGoToPlan}
              type="button"
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5 self-start sm:self-center"
            >
              <span>View Current Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="mb-6 p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              No active workout plan loaded. Generate a plan first or select a profile from the Admin Dashboard.
            </span>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="mb-6">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Common Modification Requests:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickIdeas.map((idea, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleQuickAdd(idea)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-amber-300 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/30 transition-all text-left"
              >
                + {idea}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Tell FitBuddy AI what changes you want:
            </label>
            <textarea
              rows={4}
              value={feedbackText}
              onChange={(e) => {
                setFeedbackText(e.target.value);
                if (error) setError('');
              }}
              placeholder="Example: Add more cardio, reduce workout intensity, include more rest days, add yoga…"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            />
            {error && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {error}
              </p>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>How it works:</strong> Gemini AI reads your original plan and re-engineers your 7-day schedule to fulfill your feedback. Your original plan is safely preserved in the database and accessible anytime in <strong>Plan History</strong>.
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !currentPlan}
            className={`w-full py-3.5 px-6 rounded-xl font-heading font-black text-base tracking-wide uppercase flex items-center justify-center gap-2.5 transition-all ${
              isLoading || !currentPlan
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 text-slate-950 hover:from-amber-300 hover:to-orange-300 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/35 transform hover:-translate-y-0.5 cursor-pointer'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-400 border-t-amber-400 rounded-full animate-spin"></div>
                <span>FitBuddy AI is Updating Your Workout Plan...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Update My Plan</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
