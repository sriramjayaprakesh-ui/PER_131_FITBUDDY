import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type { StoredUserPlan, DashboardStats, UserAccount } from '../src/types/fitness.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'fitbuddy_db.json');
const ACCOUNTS_FILE = path.join(DATA_DIR, 'fitbuddy_accounts.json');

const TOKEN_SECRET = process.env.AUTH_SECRET || 'fitbuddy_jwt_secret_dev_key_2026_xyz';

export interface UserAccountRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
  updatedAt: string;
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

function createToken(userId: string): string {
  const payload = `${userId}:${Date.now()}`;
  const sig = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64');
}

function parseToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return null;
    const [userId, timestamp, sig] = parts;
    const payload = `${userId}:${timestamp}`;
    const expectedSig = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('hex');
    if (crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
      return userId;
    }
    return null;
  } catch {
    return null;
  }
}

const DEFAULT_SEED_SALT = 'fitbuddy_salt_998877';

const INITIAL_SEED_ACCOUNTS: UserAccountRecord[] = [
  {
    id: 'user_acc_alex',
    name: 'Alex Rivera',
    email: 'alex@fitbuddy.io',
    passwordHash: hashPassword('password123', DEFAULT_SEED_SALT),
    salt: DEFAULT_SEED_SALT,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'user_acc_sarah',
    name: 'Sarah Chen',
    email: 'sarah@fitbuddy.io',
    passwordHash: hashPassword('password123', DEFAULT_SEED_SALT),
    salt: DEFAULT_SEED_SALT,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'user_acc_marcus',
    name: 'Marcus Johnson',
    email: 'marcus@fitbuddy.io',
    passwordHash: hashPassword('password123', DEFAULT_SEED_SALT),
    salt: DEFAULT_SEED_SALT,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

const INITIAL_SEED_USERS: StoredUserPlan[] = [
  {
    userId: 'alex_fit99',
    name: 'Alex Rivera',
    email: 'alex@fitbuddy.io',
    accountUserId: 'user_acc_alex',
    age: 28,
    weightKg: 78,
    goal: 'Muscle Gain',
    intensity: 'Medium',
    experience: 'Intermediate',
    availableDays: 5,
    duration: '45 minutes',
    preferences: 'Dumbbells and pull-up bar available. Focus on upper chest and shoulders.',
    nutritionTip: 'Prioritize 1.6–2.0g protein per kg of body weight (approx 130–155g). Fuel up with complex carbs 60-90 min pre-workout and sleep 7-8 hours for optimal muscle protein synthesis.',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    status: 'active',
    originalPlan: {
      userProfile: {
        userId: 'alex_fit99',
        name: 'Alex Rivera',
        email: 'alex@fitbuddy.io',
        accountUserId: 'user_acc_alex',
        age: 28,
        weightKg: 78,
        goal: 'Muscle Gain',
        intensity: 'Medium',
        experience: 'Intermediate',
        availableDays: 5,
        duration: '45 minutes',
        preferences: 'Dumbbells and pull-up bar available.'
      },

      motivationalQuote: 'Consistency beats intensity every single time. Build the physique one rep at a time.',
      safetyDisclaimer: 'FitBuddy provides general fitness and wellness information and is not a substitute for professional medical advice.',
      nutritionTip: 'Prioritize 1.6–2.0g protein per kg of body weight (approx 130–155g). Fuel up with complex carbs 60-90 min pre-workout.',
      generatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      days: [
        {
          day: 1,
          title: 'Day 1 – Upper Body Push & Pull',
          focus: 'Chest, Back & Shoulders Hypertrophy',
          estimatedDurationMin: 45,
          warmup: [
            { action: 'Arm circles and shoulder dislocations (with towel/band)', durationOrReps: '2 minutes', tip: 'Loosen rotator cuffs' },
            { action: 'Band pull-aparts & light bodyweight push-ups', durationOrReps: '2 sets × 10 reps', tip: 'Activate scapulae' }
          ],
          exercises: [
            { name: 'Dumbbell Incline Bench Press', targetMuscles: 'Upper Pectorals, Anterior Deltoids', sets: 4, repsOrDuration: '10–12 reps', restTime: '75 seconds', formCues: '30-degree incline, control eccentric phase for 2 seconds' },
            { name: 'Overhand Pull-ups / Assisted Pull-ups', targetMuscles: 'Latissimus Dorsi, Biceps', sets: 4, repsOrDuration: '8–10 reps', restTime: '90 seconds', formCues: 'Full extension at bottom, pull chest toward bar' },
            { name: 'Dumbbell Standing Overhead Shoulder Press', targetMuscles: 'Deltoids, Triceps', sets: 3, repsOrDuration: '10 reps', restTime: '60 seconds', formCues: 'Keep core braced, avoid arching lower back' },
            { name: 'Dumbbell Bent-Over Row', targetMuscles: 'Rhomboids, Mid-Back', sets: 3, repsOrDuration: '12 reps', restTime: '60 seconds', formCues: 'Hinge at hips, pull elbows past torso' }
          ],
          cooldown: [
            { action: 'Chest doorway stretch & overhead triceps stretch', durationOrReps: '3 minutes' },
            { action: 'Child’s pose with lat reach', durationOrReps: '2 minutes' }
          ],
          recovery: 'Consume 25g protein within 60 minutes and hydrate with at least 750ml water.'
        },
        {
          day: 2,
          title: 'Day 2 – Lower Body Strength & Core',
          focus: 'Quadriceps, Hamstrings & Core Stability',
          estimatedDurationMin: 45,
          warmup: [
            { action: 'Bodyweight deep squats & hip openers', durationOrReps: '3 minutes' },
            { action: 'Glute bridges & leg swings', durationOrReps: '2 sets × 12 reps' }
          ],
          exercises: [
            { name: 'Dumbbell Goblet Squats', targetMuscles: 'Quadriceps, Glutes', sets: 4, repsOrDuration: '12 reps', restTime: '75 seconds', formCues: 'Elbows tucked, thighs parallel to floor' },
            { name: 'Dumbbell Romanian Deadlifts', targetMuscles: 'Hamstrings, Posterior Chain', sets: 4, repsOrDuration: '10 reps', restTime: '90 seconds', formCues: 'Soft knees, push hips backward until deep hamstring stretch' },
            { name: 'Walking Lunges', targetMuscles: 'Quads, Calves, Balance', sets: 3, repsOrDuration: '10 reps per leg', restTime: '60 seconds', formCues: '90-degree bend in front and back knees' },
            { name: 'Hanging Knee Raises / Planks', targetMuscles: 'Rectus Abdominis', sets: 3, repsOrDuration: '45 seconds', restTime: '45 seconds', formCues: 'Curl pelvis up, maintain strict tension' }
          ],
          cooldown: [
            { action: 'Hamstring forward fold & quad stretch', durationOrReps: '4 minutes' }
          ],
          recovery: 'Elevate legs for 5 minutes post-workout to enhance venous return and reduce soreness.'
        },
        {
          day: 3,
          title: 'Day 3 – Active Recovery & Mobility',
          focus: 'Low-Intensity Movement & Joint Health',
          estimatedDurationMin: 30,
          warmup: [
            { action: 'Gentle brisk walk or stationary cycling', durationOrReps: '10 minutes' }
          ],
          exercises: [
            { name: 'Cat-Cow Flow & Thoracic Rotations', targetMuscles: 'Spine & Scapula', sets: 3, repsOrDuration: '10 flows', restTime: '30 seconds', formCues: 'Sync breath with movement' },
            { name: 'World’s Greatest Stretch', targetMuscles: 'Hip flexors, Groin, Torso', sets: 2, repsOrDuration: '6 reps per side', restTime: '30 seconds', formCues: 'Sink hips deep and open chest' }
          ],
          cooldown: [
            { action: 'Deep diaphragmatic box breathing', durationOrReps: '5 minutes' }
          ],
          recovery: 'Focus on clean nutrient-dense whole foods and plenty of water.'
        },
        {
          day: 4,
          title: 'Day 4 – Upper Body Hypertrophy (Chest & Arms)',
          focus: 'Muscle Volume & Arm Sculpting',
          estimatedDurationMin: 45,
          warmup: [
            { action: 'Shoulder circles, band pull-aparts, light shadow boxing', durationOrReps: '5 minutes' }
          ],
          exercises: [
            { name: 'Flat Dumbbell Press', targetMuscles: 'Pectoralis Major', sets: 4, repsOrDuration: '10 reps', restTime: '75 seconds', formCues: 'Retract shoulder blades' },
            { name: 'Dumbbell Hammer Curls', targetMuscles: 'Brachialis, Biceps', sets: 3, repsOrDuration: '12 reps', restTime: '60 seconds', formCues: 'Neutral palms, no swinging' },
            { name: 'Overhead Dumbbell Triceps Extension', targetMuscles: 'Triceps Long Head', sets: 3, repsOrDuration: '12 reps', restTime: '60 seconds', formCues: 'Keep elbows pointing forward' },
            { name: 'Dumbbell Lateral Raises', targetMuscles: 'Lateral Deltoids', sets: 4, repsOrDuration: '15 reps', restTime: '45 seconds', formCues: 'Slight bend in elbows, lead with pinkies' }
          ],
          cooldown: [
            { action: 'Biceps & triceps wall stretches', durationOrReps: '4 minutes' }
          ],
          recovery: 'Take an evening hot shower followed by magnesium-rich foods to relax muscles.'
        },
        {
          day: 5,
          title: 'Day 5 – Back Thickness & Posterior Chain',
          focus: 'Lats, Rhomboids & Erector Spinae',
          estimatedDurationMin: 45,
          warmup: [
            { action: 'Bird-Dog & Glute Bridges', durationOrReps: '2 sets × 10 reps' }
          ],
          exercises: [
            { name: 'Single-Arm Dumbbell Row', targetMuscles: 'Latissimus Dorsi', sets: 4, repsOrDuration: '10 reps per side', restTime: '60 seconds', formCues: 'Support on bench, pull dumbbell to hip' },
            { name: 'Dumbbell Pullovers', targetMuscles: 'Lats, Serratus Anterior', sets: 3, repsOrDuration: '12 reps', restTime: '60 seconds', formCues: 'Slight elbow bend, stretch through lats' },
            { name: 'Rear Delt Flyes', targetMuscles: 'Posterior Deltoids', sets: 4, repsOrDuration: '15 reps', restTime: '45 seconds', formCues: 'Hinged torso, squeeze rear delts' },
            { name: 'Side Planks with Hip Dips', targetMuscles: 'Obliques, Core', sets: 3, repsOrDuration: '10 dips per side', restTime: '45 seconds', formCues: 'Keep body in straight line' }
          ],
          cooldown: [
            { action: 'Puppy dog pose & Cobra stretch', durationOrReps: '4 minutes' }
          ],
          recovery: 'Ensure proper protein intake and rehydration.'
        },
        {
          day: 6,
          title: 'Day 6 – Full Body Conditioning & Calves',
          focus: 'Endurance, High Volume & Conditioning',
          estimatedDurationMin: 45,
          warmup: [
            { action: 'High knees, butt kicks & jumping jacks', durationOrReps: '5 minutes' }
          ],
          exercises: [
            { name: 'Dumbbell Thrusters', targetMuscles: 'Full Body (Quads, Shoulders)', sets: 3, repsOrDuration: '10 reps', restTime: '75 seconds', formCues: 'Squat deep and explode up through press' },
            { name: 'Renegade Rows', targetMuscles: 'Core, Back, Chest', sets: 3, repsOrDuration: '8 reps per side', restTime: '60 seconds', formCues: 'Resist hip rotation' },
            { name: 'Standing Dumbbell Calf Raises', targetMuscles: 'Gastrocnemius, Soleus', sets: 4, repsOrDuration: '18 reps', restTime: '45 seconds', formCues: 'Pause for 1s at peak contraction' },
            { name: 'Bicycle Crunches', targetMuscles: 'Abs & Obliques', sets: 3, repsOrDuration: '20 reps', restTime: '45 seconds', formCues: 'Slow controlled elbow to opposite knee' }
          ],
          cooldown: [
            { action: 'Full body static stretches', durationOrReps: '5 minutes' }
          ],
          recovery: 'Carb refill to replenish glycogen stores for the upcoming cycle.'
        },
        {
          day: 7,
          title: 'Day 7 – Complete Rest & Rejuvenation',
          focus: 'Restoration, Sleep & Muscle Repair',
          estimatedDurationMin: 20,
          warmup: [
            { action: 'Casual leisurely outdoor walk', durationOrReps: '15–20 minutes' }
          ],
          exercises: [
            { name: 'Gentle foam rolling / self-myofascial release', targetMuscles: 'Quads, IT Band, Upper Back', sets: 1, repsOrDuration: '10 minutes', restTime: 'None', formCues: 'Spend 30s on tight tender spots' }
          ],
          cooldown: [
            { action: '5 minutes mindful breathing & progressive muscle relaxation', durationOrReps: '5 minutes' }
          ],
          recovery: 'Aim for 8+ hours of uninterrupted sleep tonight to boost growth hormone release.'
        }
      ]
    }
  },
  {
    userId: 'sarah_c22',
    name: 'Sarah Chen',
    email: 'sarah@fitbuddy.io',
    accountUserId: 'user_acc_sarah',
    age: 34,
    weightKg: 65,
    goal: 'Weight Loss',
    intensity: 'Medium',
    experience: 'Beginner',
    availableDays: 4,
    duration: '30 minutes',
    preferences: 'Low impact on knees, no box jumps. Interested in yoga/pilates integration.',
    nutritionTip: 'Stay hydrated with at least 2.5L water daily. Prioritize lean proteins with every meal to keep you feeling full longer, and aim for a gentle caloric deficit of 300-400 kcal.',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    status: 'updated',
    feedback: 'I loved the plan, but please add a dedicated 15-minute yoga session on Day 3 and swap burpees for knee-friendly mountain climbers.',
    feedbackSubmittedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    originalPlan: {
      userProfile: {
        userId: 'sarah_c22',
        name: 'Sarah Chen',
        email: 'sarah@fitbuddy.io',
        accountUserId: 'user_acc_sarah',
        age: 34,
        weightKg: 65,
        goal: 'Weight Loss',
        intensity: 'Medium',
        experience: 'Beginner',
        availableDays: 4,
        duration: '30 minutes'
      },
      motivationalQuote: 'Small daily choices create extraordinary transformations.',
      safetyDisclaimer: 'FitBuddy provides general fitness and wellness information and is not a substitute for professional medical advice.',
      nutritionTip: 'Stay hydrated with at least 2.5L water daily. Prioritize lean proteins with every meal.',
      generatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      days: [
        {
          day: 1,
          title: 'Day 1 – Full Body Low-Impact Burn',
          focus: 'Metabolic Conditioning & Core',
          estimatedDurationMin: 30,
          warmup: [
            { action: 'Arm swings and gentle knee lifts', durationOrReps: '3 minutes' },
            { action: 'Hip hinges and ankle circles', durationOrReps: '2 minutes' }
          ],
          exercises: [
            { name: 'Chair Assisted Squats', targetMuscles: 'Quadriceps, Glutes', sets: 3, repsOrDuration: '12 reps', restTime: '45 seconds', formCues: 'Gently tap chair then rise, keep chest tall' },
            { name: 'Incline Wall or Counter Push-ups', targetMuscles: 'Chest, Arms, Core', sets: 3, repsOrDuration: '10 reps', restTime: '45 seconds', formCues: 'Brace core in a straight plank line' },
            { name: 'Standing Glute Kickbacks', targetMuscles: 'Gluteus Maximus', sets: 3, repsOrDuration: '12 reps per leg', restTime: '30 seconds', formCues: 'Squeeze glute at top, no hyperextending back' },
            { name: 'Seated Torso Twists (Russian Twists)', targetMuscles: 'Obliques', sets: 3, repsOrDuration: '16 total reps', restTime: '30 seconds', formCues: 'Feet on floor, rotate from torso' }
          ],
          cooldown: [
            { action: 'Standing calf stretch and overhead side stretch', durationOrReps: '4 minutes' }
          ],
          recovery: 'Drink 500ml water and take a 10-minute relaxing evening walk.'
        },
        {
          day: 2,
          title: 'Day 2 – Active Rest & Low Impact Cardio',
          focus: 'Aerobic Base & Calorie Burn',
          estimatedDurationMin: 30,
          warmup: [{ action: 'Light joint warmups', durationOrReps: '3 minutes' }],
          exercises: [
            { name: 'Brisk Outdoor Walking or Flat Treadmill', targetMuscles: 'Cardiovascular system', sets: 1, repsOrDuration: '25 minutes', restTime: 'None', formCues: 'Maintain conversational pace' }
          ],
          cooldown: [{ action: 'Gentle quad and hamstring stretch', durationOrReps: '3 minutes' }],
          recovery: 'Stay hydrated with herbal tea or lemon water.'
        },
        {
          day: 3,
          title: 'Day 3 – Upper Body & Stability',
          focus: 'Posture & Shoulder Endurance',
          estimatedDurationMin: 30,
          warmup: [{ action: 'Shoulder rolls & cat-cow', durationOrReps: '4 minutes' }],
          exercises: [
            { name: 'Light Dumbbell/Bottle Overhead Press', targetMuscles: 'Shoulders', sets: 3, repsOrDuration: '12 reps', restTime: '45 seconds', formCues: 'Smooth controlled tempo' },
            { name: 'Bent-Over Rows with Light Weight', targetMuscles: 'Upper Back', sets: 3, repsOrDuration: '12 reps', restTime: '45 seconds', formCues: 'Keep spine flat' },
            { name: 'Modified Knee Plank', targetMuscles: 'Core', sets: 3, repsOrDuration: '25 seconds', restTime: '45 seconds', formCues: 'Tuck hips under, press ground away' }
          ],
          cooldown: [{ action: 'Child’s pose and chest opener', durationOrReps: '4 minutes' }],
          recovery: 'Ensure a balanced meal rich in colorful vegetables.'
        },
        {
          day: 4,
          title: 'Day 4 – Rest & Hydration',
          focus: 'Total Recovery',
          estimatedDurationMin: 15,
          warmup: [{ action: 'Gentle stretching', durationOrReps: '5 minutes' }],
          exercises: [{ name: 'Leisurely stroll', targetMuscles: 'Heart & Lungs', sets: 1, repsOrDuration: '15 minutes', restTime: 'None' }],
          cooldown: [{ action: 'Deep breathing', durationOrReps: '3 minutes' }],
          recovery: '8 hours of restful sleep.'
        },
        {
          day: 5,
          title: 'Day 5 – Lower Body Tone & Balance',
          focus: 'Leg Strength & Joint Stability',
          estimatedDurationMin: 30,
          warmup: [{ action: 'Marching in place & hip circles', durationOrReps: '4 minutes' }],
          exercises: [
            { name: 'Bodyweight Step-Back Lunges', targetMuscles: 'Quads & Glutes', sets: 3, repsOrDuration: '10 per leg', restTime: '45 seconds', formCues: 'Step back gently, protect front knee' },
            { name: 'Bridge Hold with Knee Squeeze', targetMuscles: 'Glutes & Inner Thighs', sets: 3, repsOrDuration: '30 seconds', restTime: '45 seconds', formCues: 'Drive through heels' },
            { name: 'Calf Raises at Wall', targetMuscles: 'Calves', sets: 3, repsOrDuration: '15 reps', restTime: '30 seconds', formCues: 'Full extension' }
          ],
          cooldown: [{ action: 'Seated hamstring stretch', durationOrReps: '4 minutes' }],
          recovery: 'Replenish electrolytes with coconut water or lemon-salted water.'
        },
        {
          day: 6,
          title: 'Day 6 – Core & Light Mobility',
          focus: 'Core Strength & Pelvic Health',
          estimatedDurationMin: 30,
          warmup: [{ action: 'Torso twists and side bends', durationOrReps: '3 minutes' }],
          exercises: [
            { name: 'Bird Dog Exercises', targetMuscles: 'Lower Back & Core', sets: 3, repsOrDuration: '8 per side', restTime: '30 seconds', formCues: 'Reach arm and opposite leg parallel' },
            { name: 'Dead Bug Exercise', targetMuscles: 'Deep Core', sets: 3, repsOrDuration: '8 per side', restTime: '30 seconds', formCues: 'Keep lower back pressed against floor' }
          ],
          cooldown: [{ action: 'Lying spinal twist', durationOrReps: '4 minutes' }],
          recovery: 'Eat a fiber-rich meal.'
        },
        {
          day: 7,
          title: 'Day 7 – Weekly Reflection & Rest',
          focus: 'Mindful Recovery',
          estimatedDurationMin: 15,
          warmup: [{ action: 'Gentle neck and shoulder rolls', durationOrReps: '3 minutes' }],
          exercises: [{ name: 'Mindful breathing & gentle walk', targetMuscles: 'Full Body', sets: 1, repsOrDuration: '15 minutes', restTime: 'None' }],
          cooldown: [{ action: 'Gratitude relaxation', durationOrReps: '3 minutes' }],
          recovery: 'Prepare healthy meals for the week ahead.'
        }
      ]
    },
    updatedPlan: {
      userProfile: {
        userId: 'sarah_c22',
        name: 'Sarah Chen',
        age: 34,
        weightKg: 65,
        goal: 'Weight Loss',
        intensity: 'Medium',
        experience: 'Beginner',
        availableDays: 4,
        duration: '30 minutes',
        preferences: 'Added 15-min yoga flow; knee-friendly mountain climbers swapped.'
      },
      motivationalQuote: 'Honoring your body with custom modifications is the true mark of sustainable success.',
      safetyDisclaimer: 'FitBuddy provides general fitness and wellness information and is not a substitute for professional medical advice.',
      nutritionTip: 'Stay hydrated with at least 2.5L water daily. Prioritize lean proteins with every meal to keep you feeling full longer.',
      generatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      days: [
        {
          day: 1,
          title: 'Day 1 – Full Body Low-Impact Burn (Knee-Friendly)',
          focus: 'Metabolic Conditioning & Gentle Stability',
          estimatedDurationMin: 30,
          warmup: [
            { action: 'Arm swings and slow marching in place', durationOrReps: '3 minutes' },
            { action: 'Gentle cat-cow and spinal wake-up', durationOrReps: '2 minutes' }
          ],
          exercises: [
            { name: 'Chair Assisted Squats', targetMuscles: 'Quadriceps, Glutes', sets: 3, repsOrDuration: '12 reps', restTime: '45 seconds', formCues: 'Weight back in heels, soft knee alignment' },
            { name: 'Incline Wall or Counter Push-ups', targetMuscles: 'Chest, Arms, Core', sets: 3, repsOrDuration: '10 reps', restTime: '45 seconds', formCues: 'Solid core alignment' },
            { name: 'Slow Controlled Mountain Climbers (Elevated on Bench/Chair)', targetMuscles: 'Core, Cardio (No Jumping)', sets: 3, repsOrDuration: '16 slow marches', restTime: '45 seconds', formCues: 'Hands on sturdy elevated chair, knee to chest with zero impact' },
            { name: 'Standing Glute Kickbacks with Pulse', targetMuscles: 'Gluteus Maximus', sets: 3, repsOrDuration: '12 reps per leg', restTime: '30 seconds', formCues: 'Isolate glute squeeze' }
          ],
          cooldown: [
            { action: 'Calf & chest stretches against wall', durationOrReps: '4 minutes' }
          ],
          recovery: 'Drink 500ml water and enjoy a protein snack.'
        },
        {
          day: 2,
          title: 'Day 2 – Active Rest & Low Impact Cardio Walk',
          focus: 'Aerobic Base & Calorie Burn',
          estimatedDurationMin: 30,
          warmup: [{ action: 'Light joint mobility', durationOrReps: '3 minutes' }],
          exercises: [
            { name: 'Brisk Outdoor Walking or Flat Treadmill', targetMuscles: 'Cardiovascular system', sets: 1, repsOrDuration: '25 minutes', restTime: 'None', formCues: 'Comfortable steady pace' }
          ],
          cooldown: [{ action: 'Hamstring & quad standing stretch', durationOrReps: '3 minutes' }],
          recovery: 'Hydrate well throughout the afternoon.'
        },
        {
          day: 3,
          title: 'Day 3 – Vinyasa Yoga Flow & Upper Body Alignment',
          focus: 'Mindful Flexibility, Core & Postural Strength',
          estimatedDurationMin: 30,
          warmup: [
            { action: 'Pranayama deep belly breathing & seated side bends', durationOrReps: '4 minutes' }
          ],
          exercises: [
            { name: 'Sun Salutation A (Modified Step-Back)', targetMuscles: 'Total Body Mobility & Heart Rate', sets: 4, repsOrDuration: 'Smooth flows', restTime: '30 seconds', formCues: 'Step back softly, lower knees to mat for cobra' },
            { name: 'Warrior II to Peaceful Warrior Flow', targetMuscles: 'Hip Openers, Shoulders, Quads', sets: 3, repsOrDuration: '5 deep breaths per side', restTime: '30 seconds', formCues: 'Front knee tracked over middle toe, relax shoulders' },
            { name: 'Downward Facing Dog to Child’s Pose Flow', targetMuscles: 'Calves, Lats, Lower Spine', sets: 3, repsOrDuration: '6 slow transitions', restTime: '30 seconds', formCues: 'Bend knees generously to lengthen spine' },
            { name: 'Light Dumbbell/Bottle Overhead Press', targetMuscles: 'Deltoids & Traps', sets: 3, repsOrDuration: '10 reps', restTime: '45 seconds', formCues: 'Controlled tempo' }
          ],
          cooldown: [
            { action: 'Supta Baddha Konasana (Reclined Butterfly) & Savasana', durationOrReps: '5 minutes' }
          ],
          recovery: 'Feel the restored posture and calm energy.'
        },
        {
          day: 4,
          title: 'Day 4 – Rest & Hydration',
          focus: 'Muscle Recovery & Cellular Repair',
          estimatedDurationMin: 15,
          warmup: [{ action: 'Gentle neck & shoulder rolls', durationOrReps: '4 minutes' }],
          exercises: [{ name: 'Leisurely fresh-air walk', targetMuscles: 'Circulation', sets: 1, repsOrDuration: '15 minutes', restTime: 'None' }],
          cooldown: [{ action: 'Box breathing meditation', durationOrReps: '3 minutes' }],
          recovery: '8 hours of sleep.'
        },
        {
          day: 5,
          title: 'Day 5 – Knee-Safe Lower Body Toning',
          focus: 'Posterior Chain & Hip Stabilizers',
          estimatedDurationMin: 30,
          warmup: [{ action: 'Marching in place & gentle hip hinges', durationOrReps: '4 minutes' }],
          exercises: [
            { name: 'Glute Bridge with 2-Second Hold', targetMuscles: 'Gluteus Maximus & Hamstrings', sets: 4, repsOrDuration: '12 reps', restTime: '45 seconds', formCues: 'Zero pressure on knees, squeeze glutes at peak' },
            { name: 'Seated Resistance Band Leg Press or Extensions', targetMuscles: 'Quadriceps', sets: 3, repsOrDuration: '12 reps', restTime: '45 seconds', formCues: 'Keep back against chair' },
            { name: 'Standing Side Leg Lifts (Wall Support)', targetMuscles: 'Gluteus Medius & Hip Abductors', sets: 3, repsOrDuration: '12 per leg', restTime: '30 seconds', formCues: 'Keep toes facing forward' },
            { name: 'Elevated Plank Hold on Countertop', targetMuscles: 'Core & Upper Body', sets: 3, repsOrDuration: '30 seconds', restTime: '45 seconds', formCues: 'Straight spine' }
          ],
          cooldown: [{ action: 'Gentle seated figure-4 stretch', durationOrReps: '4 minutes' }],
          recovery: 'Replenish with water and nutrient-dense greens.'
        },
        {
          day: 6,
          title: 'Day 6 – Core Stability & Restorative Stretch',
          focus: 'Pelvic Floor, Core & Spinal Decompression',
          estimatedDurationMin: 30,
          warmup: [{ action: 'Torso twists & wrist rolls', durationOrReps: '3 minutes' }],
          exercises: [
            { name: 'Bird Dog with Pause', targetMuscles: 'Erector Spinae & Core', sets: 3, repsOrDuration: '8 per side', restTime: '30 seconds', formCues: 'Maintain level pelvis' },
            { name: 'Dead Bug Exercise', targetMuscles: 'Transverse Abdominis', sets: 3, repsOrDuration: '8 per side', restTime: '30 seconds', formCues: 'Lower back glued to floor' },
            { name: 'Gentle Cat-Cow Flow', targetMuscles: 'Spinal Mobility', sets: 3, repsOrDuration: '10 breath cycles', restTime: '30 seconds', formCues: 'Smooth rhythmic motion' }
          ],
          cooldown: [{ action: 'Reclining spinal twist with pillow support', durationOrReps: '5 minutes' }],
          recovery: 'Warm magnesium bath or soothing herbal tea.'
        },
        {
          day: 7,
          title: 'Day 7 – Complete Rest & Reset',
          focus: 'Total Physical & Mental Reset',
          estimatedDurationMin: 15,
          warmup: [{ action: 'Gentle stretch', durationOrReps: '3 minutes' }],
          exercises: [{ name: 'Relaxing outdoor stroll', targetMuscles: 'Heart & Mood', sets: 1, repsOrDuration: '15 minutes', restTime: 'None' }],
          cooldown: [{ action: 'Quiet reflection', durationOrReps: '3 minutes' }],
          recovery: 'Hydrate well and plan your week ahead!'
        }
      ]
    }
  },
  {
    userId: 'marcus_fit',
    name: 'Marcus Johnson',
    email: 'marcus@fitbuddy.io',
    accountUserId: 'user_acc_marcus',
    age: 42,
    weightKg: 85,
    goal: 'General Wellness',
    intensity: 'Medium',
    experience: 'Intermediate',
    availableDays: 4,
    duration: '45 minutes',
    preferences: 'Kettlebell and bodyweight. Focus on posture and heart health after desk work.',
    nutritionTip: 'Incorporate anti-inflammatory foods (berries, fatty fish, leafy greens, walnuts) to reduce oxidative stress and joint inflammation.',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    status: 'active',
    originalPlan: {
      userProfile: {
        userId: 'marcus_fit',
        name: 'Marcus Johnson',
        email: 'marcus@fitbuddy.io',
        accountUserId: 'user_acc_marcus',
        age: 42,
        weightKg: 85,
        goal: 'General Wellness',
        intensity: 'Medium',
        experience: 'Intermediate',
        availableDays: 4,
        duration: '45 minutes',
        preferences: 'Kettlebell and bodyweight.'
      },
      motivationalQuote: 'Movement is medicine. Protect your future vitality today.',
      safetyDisclaimer: 'FitBuddy provides general fitness and wellness information and is not a substitute for professional medical advice.',
      nutritionTip: 'Incorporate anti-inflammatory foods (berries, fatty fish, leafy greens, walnuts).',
      generatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      days: [
        {
          day: 1,
          title: 'Day 1 – Postural Reset & Kettlebell Conditioning',
          focus: 'Posterior Chain & Core Stamina',
          estimatedDurationMin: 45,
          warmup: [
            { action: 'Arm sweeps, band pull-aparts & thoracic openers', durationOrReps: '5 minutes' }
          ],
          exercises: [
            { name: 'Kettlebell Romanian Deadlifts', targetMuscles: 'Hamstrings, Glutes, Lower Back', sets: 4, repsOrDuration: '12 reps', restTime: '60 seconds', formCues: 'Hinge back, neutral spine' },
            { name: 'Kettlebell Goblet Squats', targetMuscles: 'Quads & Hip Mobility', sets: 4, repsOrDuration: '10 reps', restTime: '75 seconds', formCues: 'Hold bell at chest level' },
            { name: 'Push-ups with Scapular Retraction', targetMuscles: 'Chest, Triceps, Serratus', sets: 3, repsOrDuration: '12 reps', restTime: '60 seconds', formCues: 'Full lockout at top' },
            { name: 'Kettlebell Suitcase Carry', targetMuscles: 'Obliques, Grip, Core Stability', sets: 3, repsOrDuration: '40 meters per side', restTime: '45 seconds', formCues: 'Stand tall, prevent lateral lean' }
          ],
          cooldown: [
            { action: 'Doorway chest stretch & deep hip flexor stretch', durationOrReps: '5 minutes' }
          ],
          recovery: 'Drink 750ml water and do 5 minutes of focused nasal breathing.'
        },
        {
          day: 2,
          title: 'Day 2 – Cardio & Aerobic Zone 2 Work',
          focus: 'Heart Longevity & Fat Oxidation',
          estimatedDurationMin: 45,
          warmup: [{ action: 'Joint rotations and light dynamic stretches', durationOrReps: '5 minutes' }],
          exercises: [
            { name: 'Steady State Rowing or Incline Walk', targetMuscles: 'Heart & Pulmonary Endurance', sets: 1, repsOrDuration: '35 minutes', restTime: 'None', formCues: 'Nasal breathing zone 2' }
          ],
          cooldown: [{ action: 'Legs up the wall posture', durationOrReps: '5 minutes' }],
          recovery: 'Focus on magnesium-rich dinner (pumpkin seeds, spinach).'
        },
        {
          day: 3,
          title: 'Day 3 – Mobility & Desk-Worker Recovery',
          focus: 'Neck, Hips & Thoracic Spine',
          estimatedDurationMin: 30,
          warmup: [{ action: 'Gentle neck rolls and wrist circles', durationOrReps: '4 minutes' }],
          exercises: [
            { name: 'Kettlebell Halo (Light weight)', targetMuscles: 'Shoulder Mobility & Core', sets: 3, repsOrDuration: '10 circles each way', restTime: '45 seconds', formCues: 'Keep head steady, circle bell around head' },
            { name: 'Pigeon Pose or Seated Figure 4', targetMuscles: 'Piriformis & Glute Tightness', sets: 2, repsOrDuration: '90 seconds per side', restTime: '30 seconds', formCues: 'Breathe into tight hips' }
          ],
          cooldown: [{ action: 'Child’s pose with side reaches', durationOrReps: '4 minutes' }],
          recovery: 'Get outdoor sunlight and stretch breaks throughout work.'
        },
        {
          day: 4,
          title: 'Day 4 – Functional Strength & Back Density',
          focus: 'Rhomboids, Lats & Hamstrings',
          estimatedDurationMin: 45,
          warmup: [{ action: 'Cat-cow and glute bridge marches', durationOrReps: '5 minutes' }],
          exercises: [
            { name: 'Two-Handed Kettlebell Swings', targetMuscles: 'Hip Hinge, Glutes, Hamstrings', sets: 4, repsOrDuration: '15 reps', restTime: '60 seconds', formCues: 'Snap hips, explosive power from glutes' },
            { name: 'Single-Arm Kettlebell Row', targetMuscles: 'Latissimus Dorsi', sets: 3, repsOrDuration: '10 reps per side', restTime: '60 seconds', formCues: 'Pull elbow past ribs' },
            { name: 'Bodyweight Plank with Shoulder Taps', targetMuscles: 'Anti-Rotational Core', sets: 3, repsOrDuration: '20 taps', restTime: '45 seconds', formCues: 'Keep hips rock steady' }
          ],
          cooldown: [{ action: 'Cobra pose and spinal twist', durationOrReps: '5 minutes' }],
          recovery: 'Rehydrate with electrolyte mineral water.'
        },
        {
          day: 5,
          title: 'Day 5 – Active Rest & Brisk Nature Walk',
          focus: 'Low-Stress Aerobic Movement',
          estimatedDurationMin: 45,
          warmup: [{ action: 'Ankle circles & calf stretches', durationOrReps: '3 minutes' }],
          exercises: [{ name: 'Brisk park or neighborhood walk', targetMuscles: 'Mental clarity & metabolism', sets: 1, repsOrDuration: '40 minutes', restTime: 'None' }],
          cooldown: [{ action: 'Deep breathing in fresh air', durationOrReps: '2 minutes' }],
          recovery: 'Quality evening relaxation.'
        },
        {
          day: 6,
          title: 'Day 6 – Full Body Circuit & Grip Endurance',
          focus: 'Compound Athletic Stamina',
          estimatedDurationMin: 45,
          warmup: [{ action: 'Jumping jacks & arm windmills', durationOrReps: '5 minutes' }],
          exercises: [
            { name: 'Kettlebell Clean and Press', targetMuscles: 'Full Body Coordination', sets: 3, repsOrDuration: '8 per arm', restTime: '75 seconds', formCues: 'Smooth rack, press straight up' },
            { name: 'Reverse Lunges with Kettlebell Goblet Hold', targetMuscles: 'Quadriceps, Balance', sets: 3, repsOrDuration: '10 per leg', restTime: '60 seconds', formCues: 'Control downward descent' },
            { name: 'Hanging Bar Hang / Dead Hang', targetMuscles: 'Grip Strength & Shoulder Decompression', sets: 3, repsOrDuration: '30–45 seconds', restTime: '45 seconds', formCues: 'Active shoulders, breathe' }
          ],
          cooldown: [{ action: 'Full body static stretches', durationOrReps: '5 minutes' }],
          recovery: 'Optimal hydration and a wholesome dinner.'
        },
        {
          day: 7,
          title: 'Day 7 – Complete Rest & Sauna/Bath',
          focus: 'Parasympathetic System Activation',
          estimatedDurationMin: 20,
          warmup: [{ action: 'Gentle neck & upper back stretches', durationOrReps: '5 minutes' }],
          exercises: [{ name: 'Deep breathing / Meditation session', targetMuscles: 'Nervous system', sets: 1, repsOrDuration: '15 minutes', restTime: 'None' }],
          cooldown: [{ action: 'Gratitude journal / reflection', durationOrReps: '5 minutes' }],
          recovery: 'Prioritize an early night of restful sleep.'
        }
      ]
    }
  }
];

class Database {
  private users: Map<string, StoredUserPlan> = new Map();
  private accounts: Map<string, UserAccountRecord> = new Map();
  private initialized = false;

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (this.initialized) return;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      // 1. Initialize accounts
      if (fs.existsSync(ACCOUNTS_FILE)) {
        const rawAcc = fs.readFileSync(ACCOUNTS_FILE, 'utf-8');
        const parsedAcc = JSON.parse(rawAcc) as UserAccountRecord[];
        if (Array.isArray(parsedAcc) && parsedAcc.length > 0) {
          parsedAcc.forEach((acc) => this.accounts.set(acc.email.toLowerCase(), acc));
        } else {
          this.seedInitialAccounts();
        }
      } else {
        this.seedInitialAccounts();
      }

      // 2. Initialize plans
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw) as StoredUserPlan[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach((u) => {
            // Auto-backfill account links for seed demo profiles if missing
            if (!u.accountUserId) {
              if (u.userId === 'alex_fit99') {
                u.accountUserId = 'user_acc_alex';
                u.email = 'alex@fitbuddy.io';
              } else if (u.userId === 'sarah_c22') {
                u.accountUserId = 'user_acc_sarah';
                u.email = 'sarah@fitbuddy.io';
              } else if (u.userId === 'marcus_fit') {
                u.accountUserId = 'user_acc_marcus';
                u.email = 'marcus@fitbuddy.io';
              }
            }
            this.users.set(u.userId.toLowerCase(), u);
          });
          this.persist();
        } else {
          this.seedInitial();
        }
      } else {
        this.seedInitial();
      }
      this.initialized = true;
    } catch (err) {
      console.error('Error initializing database, using in-memory fallback:', err);
      this.seedInitialAccounts();
      this.seedInitial();
      this.initialized = true;
    }
  }

  private seedInitialAccounts() {
    INITIAL_SEED_ACCOUNTS.forEach((acc) => this.accounts.set(acc.email.toLowerCase(), acc));
    this.persistAccounts();
  }

  private persistAccounts() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const data = Array.from(this.accounts.values());
      fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write accounts file:', err);
    }
  }

  // Account Authentication methods
  public registerAccount(name: string, email: string, password: string): { user: UserAccount; token: string } {
    this.ensureInitialized();
    const cleanEmail = email.trim().toLowerCase();
    if (this.accounts.has(cleanEmail)) {
      throw new Error('An account with this email address already exists. Please log in.');
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);
    const now = new Date().toISOString();
    const id = `user_acc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const newRecord: UserAccountRecord = {
      id,
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      salt,
      createdAt: now,
      updatedAt: now,
    };

    this.accounts.set(cleanEmail, newRecord);
    this.persistAccounts();

    const user: UserAccount = {
      id: newRecord.id,
      name: newRecord.name,
      email: newRecord.email,
      createdAt: newRecord.createdAt,
      updatedAt: newRecord.updatedAt,
    };

    const token = createToken(newRecord.id);
    return { user, token };
  }

  public authenticateAccount(email: string, password: string): { user: UserAccount; token: string } {
    this.ensureInitialized();
    const cleanEmail = email.trim().toLowerCase();
    const record = this.accounts.get(cleanEmail);
    if (!record) {
      throw new Error('Invalid email or password.');
    }

    const testHash = hashPassword(password, record.salt);
    const isValid = crypto.timingSafeEqual(Buffer.from(testHash), Buffer.from(record.passwordHash));
    if (!isValid) {
      throw new Error('Invalid email or password.');
    }

    const user: UserAccount = {
      id: record.id,
      name: record.name,
      email: record.email,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };

    const token = createToken(record.id);
    return { user, token };
  }

  public getAccountById(id: string): UserAccount | null {
    this.ensureInitialized();
    for (const record of this.accounts.values()) {
      if (record.id === id) {
        return {
          id: record.id,
          name: record.name,
          email: record.email,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
        };
      }
    }
    return null;
  }

  public getAccountByToken(token: string): UserAccount | null {
    const userId = parseToken(token);
    if (!userId) return null;
    return this.getAccountById(userId);
  }

  public getPlansByAccountId(accountId: string): StoredUserPlan[] {
    this.ensureInitialized();
    const all = Array.from(this.users.values());
    const matched = all.filter((u) => u.accountUserId === accountId);
    matched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return matched;
  }

  private seedInitial() {
    INITIAL_SEED_USERS.forEach((u) => this.users.set(u.userId.toLowerCase(), u));
    this.persist();
  }

  private persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const data = Array.from(this.users.values());
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  public getAllUsers(filters?: {
    goal?: string;
    intensity?: string;
    experience?: string;
    search?: string;
    sortBy?: 'newest' | 'oldest' | 'goal';
  }): StoredUserPlan[] {
    this.ensureInitialized();
    let list = Array.from(this.users.values());

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.userId.toLowerCase().includes(q) ||
          u.goal.toLowerCase().includes(q)
      );
    }

    if (filters?.goal && filters.goal !== 'all') {
      list = list.filter((u) => u.goal.toLowerCase() === filters.goal?.toLowerCase());
    }

    if (filters?.intensity && filters.intensity !== 'all') {
      list = list.filter((u) => u.intensity.toLowerCase() === filters.intensity?.toLowerCase());
    }

    if (filters?.experience && filters.experience !== 'all') {
      list = list.filter((u) => u.experience.toLowerCase() === filters.experience?.toLowerCase());
    }

    if (filters?.sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (filters?.sortBy === 'goal') {
      list.sort((a, b) => a.goal.localeCompare(b.goal));
    } else {
      // default newest
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }

  public getUserById(userId: string): StoredUserPlan | null {
    this.ensureInitialized();
    if (!userId) return null;
    return this.users.get(userId.toLowerCase().trim()) || null;
  }

  public saveUser(user: StoredUserPlan): StoredUserPlan {
    this.ensureInitialized();
    this.users.set(user.userId.toLowerCase().trim(), user);
    this.persist();
    return user;
  }

  public deleteUser(userId: string): boolean {
    this.ensureInitialized();
    if (!userId) return false;
    const deleted = this.users.delete(userId.toLowerCase().trim());
    if (deleted) {
      this.persist();
    }
    return deleted;
  }

  public getStats(): DashboardStats {
    this.ensureInitialized();
    const all = Array.from(this.users.values());
    const totalUsers = all.length;
    let totalPlansGenerated = 0;
    let updatedPlans = 0;

    for (const u of all) {
      if (u.originalPlan) totalPlansGenerated++;
      if (u.updatedPlan) {
        totalPlansGenerated++;
        updatedPlans++;
      }
    }

    return {
      totalUsers,
      totalPlansGenerated,
      updatedPlans,
      activeUsers: totalUsers
    };
  }

  public resetDemo(): void {
    this.users.clear();
    this.seedInitial();
  }
}

export const db = new Database();
