import React, { useState } from 'react';
import {
  History,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Calendar,
  Layers,
  Printer,
  Download,
} from 'lucide-react';
import type { StoredUserPlan } from '../types/fitness.ts';
import { WorkoutDayCard } from './WorkoutDayCard.tsx';
import { downloadPlanAsFile } from '../utils/exportPlan.ts';

interface PlanHistoryProps {
  userRecord: StoredUserPlan | null;
  onGoToFeedback: () => void;
}

export const PlanHistory: React.FC<PlanHistoryProps> = ({
  userRecord,
  onGoToFeedback,
}) => {
  const [selectedView, setSelectedView] = useState<'updated' | 'original' | 'split'>(
    userRecord?.updatedPlan ? 'updated' : 'original'
  );
  const [expandAll, setExpandAll] = useState(false);

  if (!userRecord) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center no-print">
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
          <History className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-xl font-heading font-bold text-white mb-2">No Plan History Found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            Generate your first 7-day fitness plan on the Home page to track plan evolutions and updates.
          </p>
        </div>
      </div>
    );
  }

  const hasUpdated = !!userRecord.updatedPlan;
  const activePlan = selectedView === 'original' ? userRecord.originalPlan : (userRecord.updatedPlan || userRecord.originalPlan);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header and Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0f172a]/95 border border-slate-800 shadow-xl no-print">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center gap-1">
              <History className="w-3.5 h-3.5" />
              Plan History & Evolution
            </span>
          </div>
          <h2 className="text-2xl font-heading font-black text-white">
            {userRecord.name}&apos;s Workout Blueprint Archive
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            FitBuddy preserves both your baseline plan and feedback-driven iterations.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setSelectedView('original')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedView === 'original'
                ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Original Plan
          </button>

          <button
            onClick={() => setSelectedView('updated')}
            disabled={!hasUpdated}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
              selectedView === 'updated'
                ? 'bg-slate-800 text-amber-400 shadow-sm border border-slate-700'
                : hasUpdated
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 cursor-not-allowed'
            }`}
          >
            Updated Plan
            {hasUpdated && (
              <span className="ml-1.5 px-1.5 py-0.2 text-[9px] bg-amber-500/20 text-amber-300 rounded font-bold">
                Active
              </span>
            )}
          </button>

          {hasUpdated && (
            <button
              onClick={() => setSelectedView('split')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedView === 'split'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-white'
              }`}
            >
              Side-by-Side
            </button>
          )}
        </div>
      </div>

      {/* Feedback Banner if Updated Plan exists */}
      {hasUpdated && userRecord.feedback && (
        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 shadow-lg no-print">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                  User Feedback Provided
                </span>
                <span className="text-slate-500 text-xs">•</span>
                <span className="text-xs text-slate-400">
                  Updated: {new Date(userRecord.updatedAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm font-medium text-amber-100 italic bg-slate-900/60 p-3 rounded-xl border border-amber-500/20">
                &ldquo;{userRecord.feedback}&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}

      {!hasUpdated && (
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between gap-4 no-print">
          <div className="text-xs text-slate-400">
            You are viewing your initial baseline plan. Want adjustments? Submit feedback to generate an updated plan without losing this original.
          </div>
          <button
            onClick={onGoToFeedback}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 whitespace-nowrap transition-colors"
          >
            Improve Plan →
          </button>
        </div>
      )}

      {/* Side-by-Side Comparison Mode */}
      {selectedView === 'split' && hasUpdated && userRecord.updatedPlan && (
        <div className="space-y-6">
          <div className="text-sm font-bold text-slate-300 flex items-center justify-between pb-2 border-b border-slate-800">
            <span>Comparing Day 1 through Day 7</span>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Original
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Updated
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original Plan Column */}
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-300 font-bold text-sm flex items-center justify-between">
                <span>Original Plan (Baseline)</span>
                <span className="text-xs font-normal text-slate-400">
                  {new Date(userRecord.createdAt).toLocaleDateString()}
                </span>
              </div>
              {userRecord.originalPlan.days.map((dayPlan) => (
                <WorkoutDayCard key={`orig-${dayPlan.day}`} dayPlan={dayPlan} defaultExpanded={false} />
              ))}
            </div>

            {/* Updated Plan Column */}
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-300 font-bold text-sm flex items-center justify-between">
                <span>Updated Plan (With Feedback)</span>
                <span className="text-xs font-normal text-slate-400">
                  {new Date(userRecord.updatedAt).toLocaleDateString()}
                </span>
              </div>
              {userRecord.updatedPlan.days.map((dayPlan) => (
                <WorkoutDayCard key={`upd-${dayPlan.day}`} dayPlan={dayPlan} defaultExpanded={false} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Single Plan View (Original or Updated) */}
      {selectedView !== 'split' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-heading font-black text-white">
                  {selectedView === 'original' ? 'Original 7-Day Plan' : 'Updated 7-Day Plan'}
                </h3>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    selectedView === 'original'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                  }`}
                >
                  {selectedView === 'original' ? 'Original Baseline' : 'Feedback Adapted'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedView === 'original'
                  ? `Saved on ${new Date(userRecord.createdAt).toLocaleString()}`
                  : `Modified on ${new Date(userRecord.updatedAt).toLocaleString()}`}
              </p>
            </div>

            <div className="flex items-center gap-2 no-print">
              <button
                onClick={() => setExpandAll(!expandAll)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{expandAll ? 'Collapse All' : 'Expand All'}</span>
              </button>

              <button
                onClick={() => downloadPlanAsFile(activePlan, selectedView === 'updated')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5"
                title="Download this version"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export TXT</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5"
                title="Print this version"
              >
                <Printer className="w-3.5 h-3.5 text-cyan-400" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Nutrition tip card for this version */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-sm text-slate-200">
            <span className="text-cyan-400 font-bold block mb-1 text-xs uppercase tracking-wider">
              💡 Nutrition & Recovery Guidance:
            </span>
            <span>{activePlan.nutritionTip}</span>
          </div>

          {/* Days */}
          <div className="space-y-4">
            {activePlan.days.map((dayPlan) => (
              <WorkoutDayCard
                key={`${selectedView}-${dayPlan.day}`}
                dayPlan={dayPlan}
                defaultExpanded={expandAll}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
