import { GoogleGenAI, Type } from '@google/genai';
import type { UserProfileInput, FitnessPlan } from '../src/types/fitness.js';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const MODEL_NAME = 'gemini-3.8-flash';

const FITNESS_PLAN_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    motivationalQuote: {
      type: Type.STRING,
      description: 'A punchy, inspiring fitness quote tailored specifically to the user goal.',
    },
    nutritionTip: {
      type: Type.STRING,
      description: 'A concise, actionable 2-3 sentence nutrition and recovery tip aligned directly with the user fitness goal and intensity.',
    },
    days: {
      type: Type.ARRAY,
      description: 'The complete 7-day fitness program (Day 1 through Day 7). All 7 days must be included.',
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER, description: 'Day number (1 to 7)' },
          title: { type: Type.STRING, description: 'Descriptive title for the day, e.g. Day 1 – Full Body Foundation' },
          focus: { type: Type.STRING, description: 'Target muscle groups or primary focus for the day' },
          estimatedDurationMin: { type: Type.INTEGER, description: 'Estimated session duration in minutes' },
          warmup: {
            type: Type.ARRAY,
            description: '5-10 minutes warmup routine',
            items: {
              type: Type.OBJECT,
              properties: {
                action: { type: Type.STRING, description: 'Warm-up movement name' },
                durationOrReps: { type: Type.STRING, description: 'e.g. 3 minutes or 2 sets x 10 reps' },
                tip: { type: Type.STRING, description: 'Form or mobility cue' },
              },
              required: ['action', 'durationOrReps'],
            },
          },
          exercises: {
            type: Type.ARRAY,
            description: 'Main workout exercises (or active recovery/mobility movements if rest/recovery day)',
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: 'Exercise name' },
                targetMuscles: { type: Type.STRING, description: 'Primary muscles engaged' },
                sets: { type: Type.INTEGER, description: 'Number of sets' },
                repsOrDuration: { type: Type.STRING, description: 'e.g. 10-12 reps or 45 seconds' },
                restTime: { type: Type.STRING, description: 'Rest between sets, e.g. 60 seconds' },
                formCues: { type: Type.STRING, description: 'Crucial form or safety cue' },
              },
              required: ['name', 'targetMuscles', 'sets', 'repsOrDuration', 'restTime'],
            },
          },
          cooldown: {
            type: Type.ARRAY,
            description: 'Cool-down stretches or breathing exercises',
            items: {
              type: Type.OBJECT,
              properties: {
                action: { type: Type.STRING, description: 'Cool-down movement' },
                durationOrReps: { type: Type.STRING, description: 'e.g. 3 minutes' },
              },
              required: ['action', 'durationOrReps'],
            },
          },
          recovery: {
            type: Type.STRING,
            description: 'Specific post-workout recovery or hydration suggestion for this day',
          },
        },
        required: ['day', 'title', 'focus', 'estimatedDurationMin', 'warmup', 'exercises', 'cooldown', 'recovery'],
      },
    },
  },
  required: ['motivationalQuote', 'nutritionTip', 'days'],
};

const SAFETY_SYSTEM_INSTRUCTION = `
You are FitBuddy AI, a world-class professional certified personal trainer, athletic coach, and wellness educator.
You create personalized, practical, safe, and motivating 7-day fitness plans.

SAFETY-FIRST FITNESS MANDATES:
1. FitBuddy is a general fitness and wellness guide, NOT a medical doctor or diagnostic system.
2. NEVER diagnose medical conditions or prescribe treatments.
3. NEVER claim a workout is medically safe for every individual.
4. Strictly avoid extreme weight-loss protocols, starvation advice, or dehydrated cut tactics.
5. If the user is a Beginner, select accessible, joint-friendly, scalable exercises with crystal-clear form cues.
6. When workout days per week is less than 7 (e.g. 3-5 days), structure the remaining days as active recovery, mobility, low-impact walking, or mindful restorative rest. Day 1 through Day 7 MUST always be provided in the output.
7. Emphasize proper warm-up (5-10 mins) and cool-down to prevent injuries.
8. Always uphold the disclaimer: "FitBuddy provides general fitness and wellness information and is not a substitute for professional medical advice."
`;

export async function generateWorkoutPlan(profile: UserProfileInput): Promise<FitnessPlan> {
  const prompt = `
Create a complete personalized 7-Day Fitness Plan and tailored Nutrition/Recovery Tip for this user:

User Profile:
- Name: ${profile.name}
- Age: ${profile.age} years old
- Current Weight: ${profile.weightKg} kg
- Primary Fitness Goal: ${profile.goal}
- Target Workout Intensity: ${profile.intensity}
- Experience Level: ${profile.experience}
- Target Available Workout Days: ${profile.availableDays} days per week
- Target Workout Duration per Session: ${profile.duration}
- Specific Preferences & Equipment: ${profile.preferences ? profile.preferences : 'General home/gym setup, standard equipment'}

Instructions:
- Provide exactly 7 days (Day 1 through Day 7).
- Match the exercises and volume precisely to the user's experience (${profile.experience}) and intensity (${profile.intensity}).
- Provide realistic sets, reps/duration, and rest periods fitting within ${profile.duration}.
- Provide a concise, highly relevant Nutrition & Recovery Tip specifically geared towards their goal of "${profile.goal}".
- Provide an empowering motivational quote tailored to their journey.
`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      systemInstruction: SAFETY_SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
      responseSchema: FITNESS_PLAN_SCHEMA,
      temperature: 0.7,
    },
  });

  const rawText = response.text;
  if (!rawText) {
    throw new Error('Gemini returned an empty response. Please try again.');
  }

  const parsed = JSON.parse(rawText);

  return {
    userProfile: profile,
    motivationalQuote: parsed.motivationalQuote || 'Every step forward is a victory.',
    days: parsed.days,
    nutritionTip: parsed.nutritionTip || 'Prioritize wholesome meals, sufficient protein, and consistent hydration.',
    safetyDisclaimer: 'FitBuddy provides general fitness and wellness information and is not a substitute for professional medical advice.',
    generatedAt: new Date().toISOString(),
  };
}

export async function updateWorkoutPlan(
  originalPlan: FitnessPlan,
  feedback: string,
  profile: UserProfileInput
): Promise<FitnessPlan> {
  const prompt = `
The user has requested updates to their existing 7-Day Fitness Plan based on personal feedback.

User Profile:
- Name: ${profile.name}
- Age: ${profile.age}
- Weight: ${profile.weightKg} kg
- Goal: ${profile.goal}
- Intensity: ${profile.intensity}
- Experience: ${profile.experience}
- Workout Duration: ${profile.duration}

User Feedback / Change Request:
"${feedback}"

Original Plan Overview:
${originalPlan.days.map((d) => `Day ${d.day}: ${d.title} (${d.focus})`).join('\n')}

Instructions:
1. Carefully adapt and regenerate the complete 7-day fitness plan addressing the user's exact feedback (e.g. adding yoga, adjusting exercise types, swapping movements, increasing or reducing intensity, adding more rest days, knee-friendly variations, etc.).
2. Keep all 7 days structured with warm-up, exercises with sets/reps/rest, cool-down, and recovery.
3. Update the motivational quote and nutrition/recovery tip if relevant to the feedback.
4. Ensure the updated plan respects safety guidelines and the user's experience level.
`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      systemInstruction: SAFETY_SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
      responseSchema: FITNESS_PLAN_SCHEMA,
      temperature: 0.7,
    },
  });

  const rawText = response.text;
  if (!rawText) {
    throw new Error('Gemini returned an empty response during plan update. Please try again.');
  }

  const parsed = JSON.parse(rawText);

  return {
    userProfile: profile,
    motivationalQuote: parsed.motivationalQuote || originalPlan.motivationalQuote,
    days: parsed.days,
    nutritionTip: parsed.nutritionTip || originalPlan.nutritionTip,
    safetyDisclaimer: 'FitBuddy provides general fitness and wellness information and is not a substitute for professional medical advice.',
    generatedAt: new Date().toISOString(),
  };
}
