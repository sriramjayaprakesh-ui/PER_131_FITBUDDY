import React from 'react';
import { Sparkles, Activity, ShieldCheck, HeartPulse, ChevronDown } from 'lucide-react';

interface HeroProps {
  onScrollToForm: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToForm }) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 text-center no-print">
      {/* Background ambient glow circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-cyan-500/15 blur-3xl rounded-full pointer-events-none -z-10"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 shadow-inner mb-6">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-xs sm:text-sm font-semibold text-slate-300">
            Powered by Google Gemini AI
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">7-Day Custom Splits</span>
        </div>

        {/* Primary Title Display */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight text-white mb-3">
          Fit<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Buddy</span>
        </h1>
        
        <div className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-slate-200 mb-3 tracking-wide">
          AI Fitness Plan Generator
        </div>

        <p className="text-base sm:text-lg text-emerald-400 font-medium italic mb-6">
          “Your AI-powered personal fitness companion”
        </p>

        {/* Sub-hero section requirements */}
        <div className="max-w-2xl mx-auto mb-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur-sm">
          <h2 className="text-lg sm:text-xl font-heading font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Build Better Habits With AI
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Get a personalized 7-day workout plan powered by Google Gemini. Tailored dynamically to your age, goal, intensity level, available days, and physical preferences.
          </p>
        </div>

        {/* Feature Highlights Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto mb-8 text-left">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">7-Day Splits</div>
              <div className="text-[11px] text-slate-400">Warmup, sets, reps & rest</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
              <HeartPulse className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Nutrition & Recovery</div>
              <div className="text-[11px] text-slate-400">Goal-aligned tips</div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Safety First</div>
              <div className="text-[11px] text-slate-400">Beginner & joint safe</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={onScrollToForm}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-heading font-bold text-base text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Create Your Custom Plan</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </button>
        </div>
      </div>
    </div>
  );
};
