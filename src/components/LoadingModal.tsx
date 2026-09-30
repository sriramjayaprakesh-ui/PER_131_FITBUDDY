import React, { useEffect, useState } from 'react';
import { Dumbbell, Sparkles, HeartPulse, Activity } from 'lucide-react';

interface LoadingModalProps {
  mode: 'generate' | 'update';
}

export const LoadingModal: React.FC<LoadingModalProps> = ({ mode }) => {
  const [stepIndex, setStepIndex] = useState(0);

  const generateSteps = [
    'Analyzing your fitness goal, intensity, and experience...',
    'Designing targeted Day 1 to Day 7 training splits...',
    'Balancing volume, warm-up mobility, and rest periods...',
    'Formulating personalized nutrition & recovery guidance...',
    'Finalizing your complete 7-day FitBuddy blueprint...',
  ];

  const updateSteps = [
    'Reviewing your current plan against feedback...',
    'Recalibrating exercises, intensity, and volume...',
    'Preserving your baseline while engineering new modifications...',
    'Refreshing recovery notes and daily guidance...',
  ];

  const steps = mode === 'generate' ? generateSteps : updateSteps;

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 no-print">
      <div className="bg-[#0c1322] border border-slate-700/80 p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-b from-emerald-500/20 to-transparent blur-2xl rounded-full pointer-events-none"></div>

        {/* Animated Icon */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 animate-spin opacity-40 blur-sm"></div>
          <div className="relative w-full h-full rounded-2xl bg-[#0f192b] border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl">
            <Dumbbell className="w-10 h-10 animate-pulse transform -rotate-12" />
          </div>
        </div>

        {/* Main Title */}
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-heading font-black text-white">
            {mode === 'generate'
              ? 'FitBuddy AI is creating your personalized plan…'
              : 'FitBuddy AI is updating your workout plan…'}
          </h3>
          <p className="text-xs sm:text-sm text-emerald-400 font-semibold flex items-center justify-center gap-1.5 min-h-[40px] px-2 transition-all">
            <Sparkles className="w-4 h-4 shrink-0 animate-spin" />
            <span>{steps[stepIndex]}</span>
          </p>
        </div>

        {/* Progress Bar Animation */}
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
          <div className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 animate-pulse rounded-full w-full"></div>
        </div>

        {/* Reassuring note */}
        <p className="text-[11px] text-slate-500">
          Crafted with Google Gemini AI. Tailoring exercises safely for your body.
        </p>
      </div>
    </div>
  );
};
