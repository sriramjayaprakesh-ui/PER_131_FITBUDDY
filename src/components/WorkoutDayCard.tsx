import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import type { DayWorkoutPlan } from '../types/fitness.ts';

interface WorkoutDayCardProps {
  dayPlan: DayWorkoutPlan;
  defaultExpanded?: boolean;
}

export const WorkoutDayCard: React.FC<WorkoutDayCardProps> = ({
  dayPlan,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [completedExercises, setCompletedExercises] = useState<Record<number, boolean>>({});

  const toggleExerciseCheck = (index: number) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const isRestOrRecovery =
    dayPlan.focus.toLowerCase().includes('rest') ||
    dayPlan.focus.toLowerCase().includes('recovery') ||
    dayPlan.title.toLowerCase().includes('rest');

  return (
    <div
      className={`day-card rounded-2xl border transition-all duration-200 overflow-hidden shadow-lg ${
        isRestOrRecovery
          ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          : 'bg-[#0e1626] border-slate-800 hover:border-emerald-500/40 hover:shadow-emerald-500/5'
      }`}
    >
      {/* Day Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none border-b border-slate-800/60 bg-gradient-to-r from-slate-900/90 to-slate-900/40"
      >
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          {/* Day Badge */}
          <div
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-heading font-black text-base sm:text-lg shadow-md shrink-0 ${
              isRestOrRecovery
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'bg-emerald-500 text-slate-950 font-black shadow-emerald-500/20'
            }`}
          >
            D{dayPlan.day}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-heading font-bold text-white tracking-wide">
                {dayPlan.title}
              </h3>
              {isRestOrRecovery && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Recovery
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>🏋️ Workout Focus:</span>
              <span className="text-slate-200 font-medium">{dayPlan.focus}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>⏱️ {dayPlan.estimatedDurationMin}m</span>
          </span>
          <button
            type="button"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle details"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-6">
          {/* 1. Warm-up */}
          {dayPlan.warmup && dayPlan.warmup.length > 0 && (
            <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-3.5 sm:p-4">
              <div className="flex items-center gap-2 mb-2.5 text-xs font-extrabold uppercase tracking-wider text-amber-400">
                <span>🔥 Warm-up (5–10 minutes)</span>
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
                {dayPlan.warmup.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                    <div>
                      <span className="font-semibold text-white">{w.action}</span>
                      <span className="text-slate-400 ml-1.5">({w.durationOrReps})</span>
                      {w.tip && (
                        <span className="text-[11px] text-slate-400 block sm:inline sm:ml-2 italic">
                          Tip: {w.tip}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 2. Main Exercises */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                <span>💪 Exercises & Volume ({dayPlan.exercises.length} Movements)</span>
              </div>
              <span className="text-[11px] text-slate-500">
                Click checkmark to track progress
              </span>
            </div>

            <div className="space-y-2.5">
              {dayPlan.exercises.map((ex, exIdx) => {
                const isChecked = !!completedExercises[exIdx];
                return (
                  <div
                    key={exIdx}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isChecked
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400'
                        : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700 text-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => toggleExerciseCheck(exIdx)}
                          className={`mt-0.5 p-0.5 rounded-full transition-colors shrink-0 ${
                            isChecked
                              ? 'text-emerald-400'
                              : 'text-slate-600 hover:text-slate-400'
                          }`}
                          title="Mark completed"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-sm font-bold ${
                                isChecked ? 'line-through text-slate-400' : 'text-white'
                              }`}
                            >
                              {exIdx + 1}. {ex.name}
                            </span>
                            {ex.targetMuscles && (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
                                {ex.targetMuscles}
                              </span>
                            )}
                          </div>

                          {ex.formCues && (
                            <p className="text-xs text-slate-400 mt-1 italic flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-400/80 shrink-0" />
                              <span>{ex.formCues}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Sets, Reps & Rest stats pill */}
                      <div className="text-right shrink-0">
                        <div className="text-xs sm:text-sm font-extrabold text-emerald-400">
                          {ex.sets} sets × {ex.repsOrDuration}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center justify-end gap-1 mt-0.5">
                          <span>😴 Rest:</span>
                          <span className="text-slate-300 font-semibold">{ex.restTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Cool-down & Recovery Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {dayPlan.cooldown && dayPlan.cooldown.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300">
                <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-1.5 flex items-center gap-1.5">
                  <span>🧘 Cool-down</span>
                </div>
                <ul className="space-y-1">
                  {dayPlan.cooldown.map((cd, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-slate-300">
                      <span className="text-cyan-400">•</span>
                      <span>{cd.action}</span>
                      <span className="text-slate-500">({cd.durationOrReps})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {dayPlan.recovery && (
              <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300">
                <div className="text-[11px] font-bold uppercase tracking-wider text-teal-400 mb-1.5 flex items-center gap-1.5">
                  <span>💧 Recovery Suggestion</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{dayPlan.recovery}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
