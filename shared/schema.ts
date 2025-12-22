import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  age: integer("age"),
  gender: text("gender"), // 'male', 'female', 'other'
  height: integer("height"), // in cm
  weight: integer("weight"), // in kg
  goal: text("goal"), // 'fatLoss', 'muscleGain', 'maintenance'
  dietPref: text("diet_pref"), // 'veg', 'nonveg', 'vegan'
  workoutLoc: text("workout_loc"), // 'home', 'gym'
  timeAvail: integer("time_avail"), // 20, 40, 60 minutes
  disciplineScore: integer("discipline_score").default(0),
  streak: jsonb("streak").$type<{ workouts: number; meals: number }>().default({ workouts: 0, meals: 0 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Foreign key ref would be added in relations
  weekStartDate: timestamp("week_start_date").notNull(),
  workoutPlan: jsonb("workout_plan").notNull(), // AI generated structure
  dietPlan: jsonb("diet_plan").notNull(), // AI generated structure
  createdAt: timestamp("created_at").defaultNow(),
});

export const workoutLogs = pgTable("workout_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: timestamp("date").defaultNow(),
  details: jsonb("details").notNull(), // What they actually did
  completed: boolean("completed").default(false),
});

export const dietLogs = pgTable("diet_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: timestamp("date").defaultNow(),
  mealDetails: jsonb("meal_details").notNull(),
  calories: integer("calories"),
});

// === SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true, 
  disciplineScore: true, 
  streak: true 
});

export const insertPlanSchema = createInsertSchema(plans).omit({ id: true, createdAt: true });
export const insertWorkoutLogSchema = createInsertSchema(workoutLogs).omit({ id: true });
export const insertDietLogSchema = createInsertSchema(dietLogs).omit({ id: true });

// === EXPLICIT TYPES ===

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Plan = typeof plans.$inferSelect;
export type WorkoutLog = typeof workoutLogs.$inferSelect;
export type DietLog = typeof dietLogs.$inferSelect;

// Auth specific
export const loginSchema = z.object({
  username: z.string().email(), // mapping email to username for passport consistency
  password: z.string(),
});

export const registerSchema = insertUserSchema.extend({
  username: z.string().email(), // We use email as username
});

export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
