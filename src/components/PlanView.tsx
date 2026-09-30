import React, { useState } from 'react';
import {
  Printer,
  Download,
  RotateCcw,
  MessageSquare,
  Sparkles,
  Lightbulb,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Target,
  Zap,
  Award,
  Clock,
  Calendar,
  Layers,
  UserCheck,
} from 'lucide-react';
import type { FitnessPlan } from '../types/fitness.ts';
import { WorkoutDayCard } from './WorkoutDayCard.tsx';
import { downloadPlanAsFile } from '../utils/exportPlan.ts';

interface PlanViewProps {
  plan: FitnessPlan;
  isUpdated?: boolean;
  onGenerateNew: () => void;
  onGoToFeedback: () => void;
  onRegenerate: () => void;
}

export const PlanView: React.FC<PlanViewProps> = ({
  plan,
  isUpdated = false,
  onGenerateNew,
  onGoToFeedback,
  onRegenerate,
}) => {
  const [expandAll, setExpandAll] = useState(true);
  const profile = plan.userProfile;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    downloadPlanAsFile(plan, isUpdated);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0f172a]/95 border border-slate-800 shadow-xl no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {isUpdated ? 'Updated Custom Plan' : 'Active 7-Day Plan'}
            </span>
            <span className="text-xs text-slate-500">
              Generated: {new Date(plan.generatedAt).toLocaleDateString()}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white mt-1">
            {profile.name}&apos;s Fitness Blueprint
          </h2>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onGoToFeedback}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>Give Feedback</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Print printable workout sheet"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Print Plan</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Download text file"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download Plan</span>
          </button>

          <button
            onClick={onRegenerate}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Regenerate with fresh AI variations"
          >
            <RotateCcw className="w-4 h-4 text-violet-400" />
            <span className="hidden sm:inline">Regenerate</span>
          </button>

          <button
            onClick={onGenerateNew}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>New Plan</span>
          </button>
        </div>
      </div>

      {/* Motivational Quote Banner */}
      {plan.motivationalQuote && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/20 p-5 sm:p-6 text-center shadow-lg">
          <div className="text-xs uppercase tracking-widest text-emerald-400 font-extrabold mb-1">
            🔥 Daily Coach Motivation
          </div>
          <blockquote className="text-base sm:text-lg lg:text-xl font-heading font-extrabold text-white italic max-w-2xl mx-auto leading-relaxed">
            &ldquo;{plan.motivationalQuote}&rdquo;
          </blockquote>
        </div>
      )}

      {/* USER PROFILE CARD */}
      <div className="rounded-2xl bg-[#0f172a]/95 border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
          <h3 className="text-sm sm:text-base font-heading font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <span>👤 User Profile</span>
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-slate-900 text-cyan-400 px-2.5 py-1 rounded-lg border border-slate-700/60 font-semibold">
              ID: {profile.userId}
            </span>
            {profile.email && (
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-semibold hidden sm:inline-flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                {profile.email}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Name</span>
            <span className="text-white font-bold text-sm truncate block mt-0.5">{profile.name}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Age</span>
            <span className="text-white font-bold text-sm block mt-0.5">{profile.age} yrs</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Weight</span>
            <span className="text-white font-bold text-sm block mt-0.5">{profile.weightKg} kg</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
              <Target className="w-3 h-3 text-emerald-400" /> Goal
            </span>
            <span className="text-emerald-400 font-bold text-sm block mt-0.5 truncate">{profile.goal}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> Intensity
            </span>
            <span className="text-amber-400 font-bold text-sm block mt-0.5">{profile.intensity}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
              <Award className="w-3 h-3 text-violet-400" /> Experience
            </span>
            <span className="text-violet-300 font-bold text-sm block mt-0.5">{profile.experience}</span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" /> Duration
            </span>
            <span className="text-cyan-300 font-bold text-sm block mt-0.5">{profile.duration}</span>
          </div>
        </div>

        {profile.preferences && (
          <div className="mt-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300">
            <span className="text-slate-400 font-bold mr-1">Preferences & Gear:</span>
            <span>{profile.preferences}</span>
          </div>
        )}
      </div>

      {/* SECTION 5: AI NUTRITION & RECOVERY TIP */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c1825] to-[#0f1f33] border border-cyan-500/30 p-5 sm:p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/10">
            <Lightbulb className="w-6 h-6 text-cyan-400" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-heading font-black text-cyan-300">
                💡 AI Nutrition & Recovery Tip
              </span>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-200 border border-cyan-500/30">
                Goal: {profile.goal}
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              {plan.nutritionTip}
            </p>
          </div>
        </div>
      </div>

      {/* 7-DAY WORKOUT SCHEDULE */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="text-xl sm:text-2xl font-heading font-black text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-emerald-400" />
              <span>Your 7-Day Fitness Plan</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Each day has structured warm-up, exercises with sets/reps, rest intervals, and recovery guidance.
            </p>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              onClick={() => setExpandAll(!expandAll)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{expandAll ? 'Collapse All' : 'Expand All'}</span>
              {expandAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Cards for Day 1 through Day 7 */}
        <div className="space-y-4">
          {plan.days.map((dayPlan) => (
            <WorkoutDayCard
              key={dayPlan.day}
              dayPlan={dayPlan}
              defaultExpanded={expandAll}
            />
          ))}
        </div>
      </div>

      {/* Safety First Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-300">Safety & Wellness Notice: </span>
          <span>{plan.safetyDisclaimer}</span>
        </div>
      </div>

      {/* Bottom CTA for feedback */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#101b2f] to-slate-900 border border-slate-800 text-center no-print">
        <h4 className="text-lg font-heading font-black text-white mb-2">
          Want to adapt or personalize this plan further?
        </h4>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mb-4">
          Need more cardio, lower intensity, yoga, or adjustments for knee health? FitBuddy can modify your 7-day schedule while keeping your baseline safe.
        </p>
        <button
          onClick={onGoToFeedback}
          className="px-6 py-3 rounded-xl font-heading font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Improve My Plan with AI</span>
        </button>
      </div>
    </div>
  );
};
