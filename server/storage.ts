import { users, workoutLogs, dietLogs, plans, InsertUser, WorkoutLog, DietLog, Plan } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: InsertUser): Promise<any>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<any>;
  
  // Workout logs
  createWorkoutLog(userId: number, details: any): Promise<WorkoutLog>;
  getWorkoutLogs(userId: number): Promise<WorkoutLog[]>;
  
  // Diet logs
  createDietLog(userId: number, mealDetails: any, calories?: number): Promise<DietLog>;
  getDietLogs(userId: number): Promise<DietLog[]>;
  
  // Plans
  createPlan(userId: number, workoutPlan: any, dietPlan: any): Promise<Plan>;
  getPlanByUser(userId: number): Promise<Plan | undefined>;
  
  // Progress
  getProgressSummary(userId: number, week?: number): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<any | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<any> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<any> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async createWorkoutLog(userId: number, details: any): Promise<WorkoutLog> {
    const [log] = await db
      .insert(workoutLogs)
      .values({
        userId,
        details,
        completed: true,
      } as any)
      .returning();
    return log;
  }

  async getWorkoutLogs(userId: number): Promise<WorkoutLog[]> {
    return await db.select().from(workoutLogs).where(eq(workoutLogs.userId, userId));
  }

  async createDietLog(userId: number, mealDetails: any, calories?: number): Promise<DietLog> {
    const [log] = await db
      .insert(dietLogs)
      .values({
        userId,
        mealDetails,
        calories: calories || 0,
      } as any)
      .returning();
    return log;
  }

  async getDietLogs(userId: number): Promise<DietLog[]> {
    return await db.select().from(dietLogs).where(eq(dietLogs.userId, userId));
  }

  async createPlan(userId: number, workoutPlan: any, dietPlan: any): Promise<Plan> {
    const [plan] = await db
      .insert(plans)
      .values({
        userId,
        weekStartDate: new Date(),
        workoutPlan,
        dietPlan,
      } as any)
      .returning();
    return plan;
  }

  async getPlanByUser(userId: number): Promise<Plan | undefined> {
    const [plan] = await db.select().from(plans).where(eq(plans.userId, userId));
    return plan;
  }

  async getProgressSummary(userId: number, week?: number): Promise<any> {
    const workoutLogs = await this.getWorkoutLogs(userId);
    const dietLogs = await this.getDietLogs(userId);

    const completedWorkouts = workoutLogs.filter((log: any) => log.completed).length;
    const completedMeals = dietLogs.length;

    return {
      workoutStreak: completedWorkouts,
      mealStreak: completedMeals,
      consistency: Math.min(100, ((completedWorkouts + completedMeals) / 14) * 100),
      totalWorkouts: completedWorkouts,
      totalMeals: completedMeals,
    };
  }
}

export const storage = new DatabaseStorage();
