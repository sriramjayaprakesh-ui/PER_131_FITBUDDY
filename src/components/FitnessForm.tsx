import React, { useState, useId, useEffect } from 'react';
import {
  User,
  Hash,
  Calendar,
  Weight,
  Target,
  Zap,
  Award,
  Clock,
  Settings2,
  AlertCircle,
  Dumbbell,
  Sparkles,
  ShieldCheck,
  LogIn,
} from 'lucide-react';
import type {
  UserProfileInput,
  FitnessGoal,
  WorkoutIntensity,
  ExperienceLevel,
  WorkoutDuration,
} from '../types/fitness.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface FitnessFormProps {
  onSubmit: (profile: UserProfileInput) => void;
  isLoading: boolean;
  initialProfile?: UserProfileInput | null;
}

export const FitnessForm: React.FC<FitnessFormProps> = ({
  onSubmit,
  isLoading,
  initialProfile,
}) => {
  const defaultAutoId = useId().replace(/[^a-z0-9]/gi, '').slice(0, 6);
  const { user, openAuthModal } = useAuth();

  const [name, setName] = useState(initialProfile?.name || (user?.name ?? ''));
  const [userId, setUserId] = useState(
    initialProfile?.userId || (user ? user.name.toLowerCase().replace(/[^a-z0-9]/g, '_') : `user_${defaultAutoId}`)
  );
  const [age, setAge] = useState<string>(initialProfile?.age ? String(initialProfile.age) : '26');
  const [weightKg, setWeightKg] = useState<string>(initialProfile?.weightKg ? String(initialProfile.weightKg) : '72');
  const [goal, setGoal] = useState<FitnessGoal>(initialProfile?.goal || 'Muscle Gain');
  const [intensity, setIntensity] = useState<WorkoutIntensity>(initialProfile?.intensity || 'Medium');
  const [experience, setExperience] = useState<ExperienceLevel>(initialProfile?.experience || 'Beginner');
  const [availableDays, setAvailableDays] = useState<number>(initialProfile?.availableDays || 4);
  const [duration, setDuration] = useState<WorkoutDuration>(initialProfile?.duration || '45 minutes');
  const [preferences, setPreferences] = useState(initialProfile?.preferences || '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && !name) {
      setName(user.name);
      setUserId(user.name.toLowerCase().replace(/[^a-z0-9]/g, '_'));
    }
  }, [user]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (!userId.trim()) {
      newErrors.userId = 'User ID is required.';
    } else if (!/^[a-zA-Z0-9_-]{2,30}$/.test(userId.trim())) {
      newErrors.userId = 'User ID must be 2-30 characters (letters, numbers, underscores).';
    }

    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 10 || parsedAge > 105) {
      newErrors.age = 'Please enter an age between 10 and 105.';
    }

    const parsedWeight = parseFloat(weightKg);
    if (isNaN(parsedWeight) || parsedWeight < 25 || parsedWeight > 300) {
      newErrors.weightKg = 'Please enter a realistic weight in kg (25 - 300 kg).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!validate()) {
      return;
    }

    onSubmit({
      name: name.trim(),
      userId: userId.trim().toLowerCase(),
      age: parseInt(age, 10),
      weightKg: parseFloat(weightKg),
      goal,
      intensity,
      experience,
      availableDays,
      duration,
      preferences: preferences.trim() || undefined,
      accountUserId: user?.id,
      email: user?.email,
    });
  };


  const handleQuickPreset = (preset: {
    name: string;
    goal: FitnessGoal;
    intensity: WorkoutIntensity;
    experience: ExperienceLevel;
    days: number;
    duration: WorkoutDuration;
    pref: string;
  }) => {
    setName(preset.name);
    setGoal(preset.goal);
    setIntensity(preset.intensity);
    setExperience(preset.experience);
    setAvailableDays(preset.days);
    setDuration(preset.duration);
    setPreferences(preset.pref);
    setUserId(`${preset.name.toLowerCase().split(' ')[0]}_${Math.floor(Math.random() * 899 + 100)}`);
    setErrors({});
  };

  return (
    <div id="fitness-form-section" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 no-print">
      {/* Quick Presets for Convenient Testing */}
      <div className="mb-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Quick Preset Profiles:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              handleQuickPreset({
                name: 'Leo Thorne',
                goal: 'Muscle Gain',
                intensity: 'High',
                experience: 'Intermediate',
                days: 5,
                duration: '60 minutes',
                pref: 'Hypertrophy focused, dumbbells & barbell available',
              })
            }
            className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 border border-slate-700/60 transition-colors"
          >
            💪 Muscle Hypertrophy
          </button>
          <button
            type="button"
            onClick={() =>
              handleQuickPreset({
                name: 'Emma Watson',
                goal: 'Weight Loss',
                intensity: 'Medium',
                experience: 'Beginner',
                days: 4,
                duration: '30 minutes',
                pref: 'Joint-friendly, home bodyweight, include walking & mobility',
              })
            }
            className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 border border-slate-700/60 transition-colors"
          >
            🔥 Low-Impact Fat Loss
          </button>
          <button
            type="button"
            onClick={() =>
              handleQuickPreset({
                name: 'David Kim',
                goal: 'Flexibility',
                intensity: 'Low',
                experience: 'Beginner',
                days: 3,
                duration: '45 minutes',
                pref: 'Yoga flows, desk worker posture, tight hamstrings & lower back',
              })
            }
            className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 border border-slate-700/60 transition-colors"
          >
            🧘 Flexibility & Posture
          </button>
        </div>
      </div>

      <div className="bg-[#0f172a]/95 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl shadow-black/60 relative">
        {/* Glow accent */}
        <div className="absolute top-0 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-black text-white">
                Personalized Fitness Profile
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                FitBuddy uses these parameters to architect your custom 7-day workout plan.
              </p>
            </div>
          </div>
        </div>

        {/* Account Association Banner */}
        {user ? (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Account Linked: <strong>{user.name}</strong> ({user.email}) • This plan will be associated with your account.
              </span>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Sign in to save this plan and track your workout evolution over time.</span>
            </div>
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 font-bold flex items-center gap-1 shrink-0 transition-colors"
            >
              <LogIn className="w-3 h-3" /> Log In
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Full Name & User ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  Full Name <span className="text-red-400">*</span>
                </span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Miller"
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border ${
                  errors.name ? 'border-red-500' : 'border-slate-700 focus:border-emerald-500'
                } text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-cyan-400" />
                  User ID <span className="text-red-400">*</span>
                </span>
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g. jordan_fit"
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border ${
                  errors.userId ? 'border-red-500' : 'border-slate-700 focus:border-cyan-500'
                } text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors`}
              />
              {errors.userId && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.userId}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Age & Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Age (Years) <span className="text-red-400">*</span>
                </span>
              </label>
              <input
                type="number"
                min="10"
                max="105"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 28"
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border ${
                  errors.age ? 'border-red-500' : 'border-slate-700 focus:border-emerald-500'
                } text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors`}
              />
              {errors.age && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.age}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <Weight className="w-3.5 h-3.5 text-cyan-400" />
                  Weight (in kg) <span className="text-red-400">*</span>
                </span>
              </label>
              <input
                type="number"
                step="0.5"
                min="25"
                max="300"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="e.g. 74.5"
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border ${
                  errors.weightKg ? 'border-red-500' : 'border-slate-700 focus:border-cyan-500'
                } text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors`}
              />
              {errors.weightKg && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.weightKg}
                </p>
              )}
            </div>
          </div>

          {/* Row 3: Fitness Goal */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              <span className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                Fitness Goal <span className="text-red-400">*</span>
              </span>
            </label>
            <div className="relative">
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as FitnessGoal)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 appearance-none cursor-pointer"
              >
                <option value="Weight Loss">Weight Loss (Fat burn, calorie expenditure, stamina)</option>
                <option value="Muscle Gain">Muscle Gain (Hypertrophy, progressive overload, size)</option>
                <option value="General Wellness">General Wellness (Longevity, vitality, balance)</option>
                <option value="Strength">Strength (Raw power, compound lifts, neurological adaptation)</option>
                <option value="Flexibility">Flexibility (Mobility, joint decompression, yoga)</option>
                <option value="Endurance">Endurance (Cardiovascular capacity, aerobic stamina)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
          </div>

          {/* Row 4: Intensity & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Workout Intensity <span className="text-red-400">*</span>
                </span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Low', 'Medium', 'High'] as WorkoutIntensity[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setIntensity(level)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      intensity === level
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/10'
                        : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-violet-400" />
                  Experience Level <span className="text-red-400">*</span>
                </span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as ExperienceLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setExperience(lvl)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border ${
                      experience === lvl
                        ? 'bg-violet-500/20 text-violet-300 border-violet-500/50 shadow-sm shadow-violet-500/10'
                        : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 5: Available Days & Preferred Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                <span className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    Available Workout Days:
                  </span>
                  <span className="text-emerald-400 font-extrabold text-sm">
                    {availableDays} Days / Week
                  </span>
                </span>
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setAvailableDays(num)}
                    className={`flex-1 py-2 rounded-lg text-xs font-black transition-all ${
                      availableDays === num
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {num}d
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Remaining days will be generated as active recovery & restorative mobility.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Preferred Workout Duration <span className="text-red-400">*</span>
                </span>
              </label>
              <div className="relative">
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value as WorkoutDuration)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 appearance-none cursor-pointer"
                >
                  <option value="20 minutes">20 minutes (Quick high-efficiency blast)</option>
                  <option value="30 minutes">30 minutes (Fast, focused session)</option>
                  <option value="45 minutes">45 minutes (Standard balanced workout)</option>
                  <option value="60 minutes">60 minutes (Comprehensive session with full rest)</option>
                  <option value="90 minutes">90 minutes (Advanced athletic volume)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                  ▼
                </div>
              </div>
            </div>
          </div>

          {/* Row 6: Optional Fitness Preferences */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              <span className="flex items-center gap-1.5">
                <Settings2 className="w-3.5 h-3.5 text-slate-400" />
                Optional Fitness Preferences & Equipment
              </span>
            </label>
            <textarea
              rows={2}
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="e.g. Home dumbbells only, no jumping (knee friendly), focus on posture and core, include outdoor walking..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Safety Disclaimer Note */}
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <span className="text-amber-400 text-sm font-bold">⚠️</span>
            <span>
              <strong>Wellness Notice:</strong> FitBuddy provides general fitness and wellness information and is not a substitute for professional medical advice. Always listen to your body and consult a physician before starting any new training regime.
            </span>
          </div>

          {/* Big Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-xl font-heading font-black text-lg tracking-wide uppercase flex items-center justify-center gap-3 transition-all ${
                isLoading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 hover:from-emerald-300 hover:to-cyan-300 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/35 transform hover:-translate-y-0.5 cursor-pointer'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-400 border-t-emerald-400 rounded-full animate-spin"></div>
                  <span>FitBuddy AI is Crafting Your 7-Day Plan...</span>
                </>
              ) : (
                <>
                  <Dumbbell className="w-6 h-6 transform -rotate-12" />
                  <span>Generate My Fitness Plan</span>
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
