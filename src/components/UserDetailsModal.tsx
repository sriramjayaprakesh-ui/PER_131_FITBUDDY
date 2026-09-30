import React, { useState } from 'react';
import {
  X,
  User,
  Target,
  Zap,
  Award,
  Clock,
  Calendar,
  MessageSquare,
  Sparkles,
  Download,
  Printer,
} from 'lucide-react';
import type { StoredUserPlan } from '../types/fitness.ts';
import { WorkoutDayCard } from './WorkoutDayCard.tsx';
import { downloadPlanAsFile } from '../utils/exportPlan.ts';

interface UserDetailsModalProps {
  user: StoredUserPlan | null;
  initialTab?: 'profile' | 'original' | 'updated' | 'feedback';
  onClose: () => void;
  onSelectForActive: (user: StoredUserPlan) => void;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  initialTab = 'profile',
  onClose,
  onSelectForActive,
}) => {
  const [tab, setTab] = useState<'profile' | 'original' | 'updated' | 'feedback'>(initialTab);

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c1322] border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-heading font-bold text-white">{user.name}</h3>
                <span className="text-xs font-mono bg-slate-800 text-cyan-400 px-2 py-0.5 rounded">
                  {user.userId}
                </span>
                {user.status === 'updated' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    Updated Plan
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Created: {new Date(user.createdAt).toLocaleDateString()} • Goal: {user.goal}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectForActive(user)}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load in Main App</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-800/80 bg-slate-900/50 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setTab('profile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              tab === 'profile'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Profile Overview
          </button>
          <button
            onClick={() => setTab('original')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              tab === 'original'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Original Plan (7-Day)
          </button>
          <button
            onClick={() => setTab('updated')}
            disabled={!user.updatedPlan}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              tab === 'updated'
                ? 'bg-slate-800 text-amber-400 border border-slate-700'
                : user.updatedPlan
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 cursor-not-allowed'
            }`}
          >
            Updated Plan {user.updatedPlan ? '(Available)' : '(None)'}
          </button>
          <button
            onClick={() => setTab('feedback')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              tab === 'feedback'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Feedback Notes {user.feedback ? '✓' : ''}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {tab === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-500 font-bold block">Age</span>
                  <span className="text-white font-bold text-base">{user.age} years</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-500 font-bold block">Weight</span>
                  <span className="text-white font-bold text-base">{user.weightKg} kg</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-500 font-bold block flex items-center gap-1">
                    <Target className="w-3 h-3 text-emerald-400" /> Goal
                  </span>
                  <span className="text-emerald-400 font-bold text-base truncate block">{user.goal}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-500 font-bold block flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" /> Intensity
                  </span>
                  <span className="text-amber-400 font-bold text-base">{user.intensity}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-500 font-bold block flex items-center gap-1">
                    <Award className="w-3 h-3 text-violet-400" /> Experience
                  </span>
                  <span className="text-violet-300 font-bold text-base">{user.experience}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-500 font-bold block flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" /> Duration
                  </span>
                  <span className="text-cyan-300 font-bold text-base">{user.duration}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 col-span-2">
                  <span className="text-[10px] uppercase text-slate-500 font-bold block flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-emerald-400" /> Available Days
                  </span>
                  <span className="text-white font-bold text-base">{user.availableDays} Days per week</span>
                </div>
              </div>

              {user.preferences && (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                  <span className="text-slate-400 font-bold block mb-1">Preferences & Limitations:</span>
                  <span>{user.preferences}</span>
                </div>
              )}

              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200">
                <span className="font-bold block mb-1 text-cyan-300 uppercase tracking-wider">
                  💡 Tailored Nutrition Tip:
                </span>
                <span>{user.nutritionTip}</span>
              </div>
            </div>
          )}

          {tab === 'original' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Original 7-Day Fitness Plan (Baseline)
                </span>
                <button
                  onClick={() => downloadPlanAsFile(user.originalPlan, false)}
                  className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1"
                >
                  <Download className="w-3 h-3" /> Export TXT
                </button>
              </div>
              <div className="space-y-3">
                {user.originalPlan.days.map((dayPlan) => (
                  <WorkoutDayCard key={dayPlan.day} dayPlan={dayPlan} defaultExpanded={false} />
                ))}
              </div>
            </div>
          )}

          {tab === 'updated' && user.updatedPlan && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Updated 7-Day Fitness Plan (Feedback Adapted)
                </span>
                <button
                  onClick={() => downloadPlanAsFile(user.updatedPlan!, true)}
                  className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1"
                >
                  <Download className="w-3 h-3" /> Export TXT
                </button>
              </div>
              <div className="space-y-3">
                {user.updatedPlan.days.map((dayPlan) => (
                  <WorkoutDayCard key={dayPlan.day} dayPlan={dayPlan} defaultExpanded={false} />
                ))}
              </div>
            </div>
          )}

          {tab === 'feedback' && (
            <div className="space-y-4">
              {user.feedback ? (
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <MessageSquare className="w-4 h-4" />
                    <span>User Improvement Request</span>
                  </div>
                  <p className="text-sm text-slate-200 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    &ldquo;{user.feedback}&rdquo;
                  </p>
                  <div className="text-[11px] text-slate-400">
                    Submitted: {user.feedbackSubmittedAt ? new Date(user.feedbackSubmittedAt).toLocaleString() : 'N/A'}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No feedback has been submitted yet for this user.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
