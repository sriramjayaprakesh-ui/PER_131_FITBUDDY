export type FitnessGoal =
  | 'Weight Loss'
  | 'Muscle Gain'
  | 'General Wellness'
  | 'Strength'
  | 'Flexibility'
  | 'Endurance';

export type WorkoutIntensity = 'Low' | 'Medium' | 'High';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type WorkoutDuration =
  | '20 minutes'
  | '30 minutes'
  | '45 minutes'
  | '60 minutes'
  | '90 minutes';

export interface UserProfileInput {
  name: string;
  userId: string;
  age: number;
  weightKg: number;
  goal: FitnessGoal;
  intensity: WorkoutIntensity;
  experience: ExperienceLevel;
  availableDays: number;
  duration: WorkoutDuration;
  preferences?: string;
  accountUserId?: string;
  email?: string;
}

export interface WarmupItem {
  action: string;
  durationOrReps: string;
  tip?: string;
}

export interface ExerciseItem {
  name: string;
  targetMuscles: string;
  sets: number;
  repsOrDuration: string;
  restTime: string;
  formCues?: string;
}

export interface CooldownItem {
  action: string;
  durationOrReps: string;
}

export interface DayWorkoutPlan {
  day: number;
  title: string;
  focus: string;
  estimatedDurationMin: number;
  warmup: WarmupItem[];
  exercises: ExerciseItem[];
  cooldown: CooldownItem[];
  recovery: string;
}

export interface FitnessPlan {
  userProfile: UserProfileInput;
  motivationalQuote: string;
  days: DayWorkoutPlan[];
  nutritionTip: string;
  safetyDisclaimer: string;
  generatedAt: string;
}

export interface StoredUserPlan {
  userId: string;
  name: string;
  email?: string;
  accountUserId?: string;
  age: number;
  weightKg: number;
  goal: FitnessGoal;
  intensity: WorkoutIntensity;
  experience: ExperienceLevel;
  availableDays: number;
  duration: WorkoutDuration;
  preferences?: string;
  originalPlan: FitnessPlan;
  feedback?: string;
  feedbackSubmittedAt?: string;
  updatedPlan?: FitnessPlan;
  nutritionTip: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'updated';
}

export interface DashboardStats {
  totalUsers: number;
  totalPlansGenerated: number;
  updatedPlans: number;
  activeUsers: number;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  user: UserAccount;
  token: string;
  message?: string;
  error?: string;
}

