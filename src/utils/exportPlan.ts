import type { FitnessPlan } from '../types/fitness.ts';

export function formatPlanAsText(plan: FitnessPlan, isUpdated = false): string {
  const profile = plan.userProfile;
  let text = `========================================================\n`;
  text += `FITBUDDY – AI FITNESS PLAN GENERATOR\n`;
  text += `Your AI-Powered Personal Fitness Companion\n`;
  text += `========================================================\n\n`;

  text += `USER PROFILE:\n`;
  text += `Name: ${profile.name}\n`;
  text += `User ID: ${profile.userId}\n`;
  text += `Age: ${profile.age} years old\n`;
  text += `Weight: ${profile.weightKg} kg\n`;
  text += `Goal: ${profile.goal}\n`;
  text += `Intensity: ${profile.intensity}\n`;
  text += `Experience: ${profile.experience}\n`;
  text += `Session Duration: ${profile.duration}\n`;
  text += `Available Days: ${profile.availableDays} days/week\n`;
  if (profile.preferences) {
    text += `Preferences/Notes: ${profile.preferences}\n`;
  }
  text += `Plan Status: ${isUpdated ? 'UPDATED PLAN (Based on Feedback)' : 'ORIGINAL PLAN'}\n`;
  text += `Generated At: ${new Date(plan.generatedAt).toLocaleString()}\n\n`;

  text += `MOTIVATIONAL QUOTE:\n"${plan.motivationalQuote}"\n\n`;

  text += `💡 AI NUTRITION & RECOVERY TIP:\n${plan.nutritionTip}\n\n`;

  text += `========================================================\n`;
  text += `7-DAY WORKOUT SCHEDULE\n`;
  text += `========================================================\n\n`;

  plan.days.forEach((day) => {
    text += `--------------------------------------------------------\n`;
    text += `DAY ${day.day}: ${day.title.toUpperCase()}\n`;
    text += `Focus: ${day.focus} | Est. Duration: ${day.estimatedDurationMin} mins\n`;
    text += `--------------------------------------------------------\n`;

    text += `🔥 WARM-UP (5-10 MIN):\n`;
    day.warmup.forEach((w, i) => {
      text += `  ${i + 1}. ${w.action} (${w.durationOrReps})${w.tip ? ` - Tip: ${w.tip}` : ''}\n`;
    });

    text += `\n💪 EXERCISES:\n`;
    day.exercises.forEach((ex, i) => {
      text += `  ${i + 1}. ${ex.name}\n`;
      text += `     Target Muscles: ${ex.targetMuscles}\n`;
      text += `     Sets & Reps: ${ex.sets} sets × ${ex.repsOrDuration}\n`;
      text += `     Rest: ${ex.restTime}\n`;
      if (ex.formCues) {
        text += `     Form Cue: ${ex.formCues}\n`;
      }
    });

    text += `\n🧘 COOL-DOWN:\n`;
    day.cooldown.forEach((cd, i) => {
      text += `  ${i + 1}. ${cd.action} (${cd.durationOrReps})\n`;
    });

    text += `\n💧 RECOVERY SUGGESTION:\n  ${day.recovery}\n\n`;
  });

  text += `========================================================\n`;
  text += `DISCLAIMER: ${plan.safetyDisclaimer}\n`;
  text += `========================================================\n`;

  return text;
}

export function downloadPlanAsFile(plan: FitnessPlan, isUpdated = false): void {
  const content = formatPlanAsText(plan, isUpdated);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `FitBuddy_${plan.userProfile.userId}_${isUpdated ? 'Updated' : 'Original'}_Plan.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
