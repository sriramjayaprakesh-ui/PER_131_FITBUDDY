import { Router, type Request, type Response } from 'express';
import { db } from './database.js';
import { generateWorkoutPlan, updateWorkoutPlan } from './geminiService.js';
import type { UserProfileInput, StoredUserPlan, FitnessGoal, WorkoutIntensity, ExperienceLevel, WorkoutDuration, UserAccount } from '../src/types/fitness.js';

function getAuthenticatedUser(req: Request): UserAccount | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.slice(7).trim();
  return db.getAccountByToken(token);
}

export function createApiRouter(): Router {
  const router = Router();

  // POST /api/auth/signup
  router.post('/auth/signup', (req: Request, res: Response): void => {
    try {
      const { name, email, password } = req.body;

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        res.status(400).json({ success: false, error: 'Full name is required.' });
        return;
      }

      if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
        return;
      }

      if (!password || typeof password !== 'string' || password.length < 6) {
        res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
        return;
      }

      const { user, token } = db.registerAccount(name, email, password);

      res.status(201).json({
        success: true,
        user,
        token,
        message: 'Account created successfully!',
      });
    } catch (err: any) {
      console.error('Signup error:', err);
      res.status(400).json({
        success: false,
        error: err.message || 'Failed to create account.',
      });
    }
  });

  // POST /api/auth/login
  router.post('/auth/login', (req: Request, res: Response): void => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, error: 'Email and password are required.' });
        return;
      }

      const { user, token } = db.authenticateAccount(email, password);

      res.status(200).json({
        success: true,
        user,
        token,
        message: 'Logged in successfully!',
      });
    } catch (err: any) {
      console.error('Login error:', err);
      res.status(401).json({
        success: false,
        error: err.message || 'Invalid email or password.',
      });
    }
  });

  // GET /api/auth/me
  router.get('/auth/me', (req: Request, res: Response): void => {
    try {
      const user = getAuthenticatedUser(req);
      if (!user) {
        res.status(401).json({ success: false, error: 'Not authenticated or session expired.' });
        return;
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch (err: any) {
      console.error('Auth verification error:', err);
      res.status(500).json({ success: false, error: 'Failed to verify session.' });
    }
  });

  // GET /api/auth/my-plans
  router.get('/auth/my-plans', (req: Request, res: Response): void => {
    try {
      const user = getAuthenticatedUser(req);
      if (!user) {
        res.status(401).json({ success: false, error: 'Please log in to view your account plans.' });
        return;
      }
      const plans = db.getPlansByAccountId(user.id);
      res.status(200).json({
        success: true,
        plans,
      });
    } catch (err: any) {
      console.error('Error fetching user plans:', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve your workout plans.' });
    }
  });

  // POST /api/generate-workout
  router.post('/generate-workout', async (req: Request, res: Response): Promise<void> => {
    try {
      const authUser = getAuthenticatedUser(req);
      const {
        name,
        userId,
        age,
        weightKg,
        goal,
        intensity,
        experience,
        availableDays,
        duration,
        preferences,
        accountUserId,
        email,
      } = req.body;

      // Validation
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        res.status(400).json({ error: 'Full Name is required.' });
        return;
      }

      if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
        res.status(400).json({ error: 'User ID is required.' });
        return;
      }

      const numAge = Number(age);
      if (isNaN(numAge) || numAge < 10 || numAge > 110) {
        res.status(400).json({ error: 'Please enter a valid age between 10 and 110.' });
        return;
      }

      const numWeight = Number(weightKg);
      if (isNaN(numWeight) || numWeight < 25 || numWeight > 350) {
        res.status(400).json({ error: 'Please enter a valid weight in kg (between 25kg and 350kg).' });
        return;
      }

      const validGoals: FitnessGoal[] = ['Weight Loss', 'Muscle Gain', 'General Wellness', 'Strength', 'Flexibility', 'Endurance'];
      if (!validGoals.includes(goal)) {
        res.status(400).json({ error: `Invalid fitness goal. Must be one of: ${validGoals.join(', ')}` });
        return;
      }

      const validIntensities: WorkoutIntensity[] = ['Low', 'Medium', 'High'];
      if (!validIntensities.includes(intensity)) {
        res.status(400).json({ error: `Invalid intensity. Must be Low, Medium, or High.` });
        return;
      }

      const validExperiences: ExperienceLevel[] = ['Beginner', 'Intermediate', 'Advanced'];
      if (!validExperiences.includes(experience)) {
        res.status(400).json({ error: `Invalid experience. Must be Beginner, Intermediate, or Advanced.` });
        return;
      }

      const validDurations: WorkoutDuration[] = ['20 minutes', '30 minutes', '45 minutes', '60 minutes', '90 minutes'];
      if (!validDurations.includes(duration)) {
        res.status(400).json({ error: `Invalid workout duration.` });
        return;
      }

      const numDays = Math.min(Math.max(Number(availableDays) || 4, 1), 7);

      const cleanUserId = userId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');

      const resolvedAccountUserId = authUser?.id || (typeof accountUserId === 'string' ? accountUserId : undefined);
      const resolvedEmail = authUser?.email || (typeof email === 'string' ? email : undefined);

      const profile: UserProfileInput = {
        name: name.trim(),
        userId: cleanUserId,
        age: Math.round(numAge),
        weightKg: Math.round(numWeight * 10) / 10,
        goal,
        intensity,
        experience,
        availableDays: numDays,
        duration,
        preferences: preferences ? String(preferences).trim() : undefined,
        accountUserId: resolvedAccountUserId,
        email: resolvedEmail,
      };

      // Call Gemini
      const plan = await generateWorkoutPlan(profile);

      // Check existing user to preserve created date or previous feedback history if re-generating
      const existing = db.getUserById(cleanUserId);
      const now = new Date().toISOString();

      const storedUser: StoredUserPlan = {
        userId: cleanUserId,
        name: profile.name,
        email: resolvedEmail || existing?.email,
        accountUserId: resolvedAccountUserId || existing?.accountUserId,
        age: profile.age,
        weightKg: profile.weightKg,
        goal: profile.goal,
        intensity: profile.intensity,
        experience: profile.experience,
        availableDays: profile.availableDays,
        duration: profile.duration,
        preferences: profile.preferences,
        originalPlan: plan,
        feedback: undefined,
        updatedPlan: undefined,
        feedbackSubmittedAt: undefined,
        nutritionTip: plan.nutritionTip,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
        status: 'active',
      };

      db.saveUser(storedUser);

      res.status(200).json({
        success: true,
        user: storedUser,
      });
    } catch (err: any) {
      console.error('Error generating workout plan:', err);
      res.status(500).json({
        error: err.message || 'Something went wrong while generating your plan. Please try again.',
      });
    }
  });

  // POST /api/submit-feedback
  router.post('/submit-feedback', async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, feedback } = req.body;

      if (!userId || typeof userId !== 'string') {
        res.status(400).json({ error: 'User ID is required to submit feedback.' });
        return;
      }

      if (!feedback || typeof feedback !== 'string' || feedback.trim().length < 3) {
        res.status(400).json({ error: 'Please provide constructive feedback or modification request.' });
        return;
      }

      const existingUser = db.getUserById(userId);
      if (!existingUser) {
        res.status(404).json({ error: 'Workout plan not found for the specified User ID. Please generate a plan first.' });
        return;
      }

      const profile: UserProfileInput = {
        name: existingUser.name,
        userId: existingUser.userId,
        age: existingUser.age,
        weightKg: existingUser.weightKg,
        goal: existingUser.goal,
        intensity: existingUser.intensity,
        experience: existingUser.experience,
        availableDays: existingUser.availableDays,
        duration: existingUser.duration,
        preferences: existingUser.preferences,
        accountUserId: existingUser.accountUserId,
        email: existingUser.email,
      };

      const updatedPlan = await updateWorkoutPlan(existingUser.originalPlan, feedback.trim(), profile);

      const now = new Date().toISOString();
      const updatedUser: StoredUserPlan = {
        ...existingUser,
        feedback: feedback.trim(),
        feedbackSubmittedAt: now,
        updatedPlan,
        status: 'updated',
        updatedAt: now,
      };

      db.saveUser(updatedUser);

      res.status(200).json({
        success: true,
        user: updatedUser,
      });
    } catch (err: any) {
      console.error('Error updating workout plan with feedback:', err);
      res.status(500).json({
        error: err.message || 'Something went wrong while updating your plan. Please try again.',
      });
    }
  });


  // GET /api/users
  router.get('/users', (req: Request, res: Response): void => {
    try {
      const { goal, intensity, experience, search, sortBy } = req.query;
      const users = db.getAllUsers({
        goal: typeof goal === 'string' ? goal : undefined,
        intensity: typeof intensity === 'string' ? intensity : undefined,
        experience: typeof experience === 'string' ? experience : undefined,
        search: typeof search === 'string' ? search : undefined,
        sortBy: sortBy === 'oldest' || sortBy === 'goal' ? sortBy : 'newest',
      });

      res.status(200).json({
        success: true,
        users,
      });
    } catch (err: any) {
      console.error('Error listing users:', err);
      res.status(500).json({ error: 'Failed to retrieve user list.' });
    }
  });

  // GET /api/users/:user_id
  router.get('/users/:user_id', (req: Request, res: Response): void => {
    try {
      const userId = req.params.user_id;
      const user = db.getUserById(userId);
      if (!user) {
        res.status(404).json({ error: `User with ID '${userId}' was not found.` });
        return;
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch (err: any) {
      console.error('Error fetching user:', err);
      res.status(500).json({ error: 'Failed to fetch user profile.' });
    }
  });

  // DELETE /api/users/:user_id
  router.delete('/users/:user_id', (req: Request, res: Response): void => {
    try {
      const userId = req.params.user_id;
      const deleted = db.deleteUser(userId);
      if (!deleted) {
        res.status(404).json({ error: `User '${userId}' not found or already deleted.` });
        return;
      }
      res.status(200).json({
        success: true,
        message: `User '${userId}' successfully deleted.`,
      });
    } catch (err: any) {
      console.error('Error deleting user:', err);
      res.status(500).json({ error: 'Failed to delete user.' });
    }
  });

  // GET /api/stats
  router.get('/stats', (_req: Request, res: Response): void => {
    try {
      const stats = db.getStats();
      res.status(200).json({
        success: true,
        stats,
      });
    } catch (err: any) {
      console.error('Error fetching stats:', err);
      res.status(500).json({ error: 'Failed to fetch dashboard stats.' });
    }
  });

  // POST /api/reset-demo
  router.post('/reset-demo', (_req: Request, res: Response): void => {
    try {
      db.resetDemo();
      res.status(200).json({
        success: true,
        message: 'Demo dataset restored successfully.',
      });
    } catch (err: any) {
      console.error('Error resetting demo:', err);
      res.status(500).json({ error: 'Failed to reset demo dataset.' });
    }
  });

  return router;
}
