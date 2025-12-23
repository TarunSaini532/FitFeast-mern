import { z } from "zod";

// ========================================
// MONGODB SCHEMAS (Mongoose-compatible)
// ========================================

// User Schema
export const userSchema = z.object({
  _id: z.string().optional(),
  email: z.string().email(),
  password: z.string(),
  age: z.number().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  height: z.number().optional(),
  weight: z.number().optional(),
  goal: z.enum(["fatLoss", "muscleGain", "maintenance"]).optional(),
  dietPref: z.enum(["veg", "nonveg", "vegan"]).optional(),
  workoutLoc: z.enum(["home", "gym"]).optional(),
  timeAvail: z.number().optional(),
  disciplineScore: z.number().default(0),
  streak: z.object({
    workouts: z.number().default(0),
    meals: z.number().default(0),
  }).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Meal Reminder Schema
export const mealReminderSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  scheduledTime: z.string(), // HH:mm format (e.g., "08:00")
  enabled: z.boolean().default(true),
  notificationSent: z.boolean().default(false),
  lastNotificationDate: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Workout Log Schema
export const workoutLogSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  date: z.date(),
  details: z.array(z.object({
    name: z.string(),
    sets: z.number().optional(),
    reps: z.number().optional(),
    weight: z.number().optional(),
    duration: z.number().optional(),
    caloriesBurned: z.number().optional(),
  })),
  completed: z.boolean().default(false),
  createdAt: z.date().optional(),
});

// Diet Log Schema
export const dietLogSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  date: z.date(),
  mealDetails: z.array(z.object({
    name: z.string(),
    calories: z.number().optional(),
    protein: z.number().optional(),
    carbs: z.number().optional(),
    fats: z.number().optional(),
  })),
  calories: z.number().optional(),
  createdAt: z.date().optional(),
});

// Plan Schema
export const planSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  weekStartDate: z.date(),
  workoutPlan: z.any(),
  dietPlan: z.any(),
  createdAt: z.date().optional(),
});

// ========================================
// TYPE EXPORTS
// ========================================

export type User = z.infer<typeof userSchema>;
export type MealReminder = z.infer<typeof mealReminderSchema>;
export type WorkoutLog = z.infer<typeof workoutLogSchema>;
export type DietLog = z.infer<typeof dietLogSchema>;
export type Plan = z.infer<typeof planSchema>;

// Auth specific
export const loginSchema = z.object({
  username: z.string().email(),
  password: z.string(),
});

export const registerSchema = userSchema.extend({
  username: z.string().email(),
}).omit({ _id: true, createdAt: true, updatedAt: true });

export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;

// Insert schemas (without auto-generated fields)
export const insertUserSchema = userSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
  disciplineScore: true,
  streak: true,
});

export const insertMealReminderSchema = mealReminderSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
  notificationSent: true,
  lastNotificationDate: true,
});

export const insertWorkoutLogSchema = workoutLogSchema.omit({
  _id: true,
  createdAt: true,
});

export const insertDietLogSchema = dietLogSchema.omit({
  _id: true,
  createdAt: true,
});

export const insertPlanSchema = planSchema.omit({
  _id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertMealReminder = z.infer<typeof insertMealReminderSchema>;
export type InsertWorkoutLog = z.infer<typeof insertWorkoutLogSchema>;
export type InsertDietLog = z.infer<typeof insertDietLogSchema>;
export type InsertPlan = z.infer<typeof insertPlanSchema>;
