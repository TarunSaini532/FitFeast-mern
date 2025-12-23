import { User, WorkoutLog, DietLog, Plan, MealReminder } from "./models";
import type { InsertUser, InsertMealReminder } from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: InsertUser): Promise<any>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<any>;

  // Workout logs
  createWorkoutLog(userId: string, details: any): Promise<any>;
  getWorkoutLogs(userId: string): Promise<any[]>;

  // Diet logs
  createDietLog(userId: string, mealDetails: any, calories?: number): Promise<any>;
  getDietLogs(userId: string): Promise<any[]>;

  // Plans
  createPlan(userId: string, workoutPlan: any, dietPlan: any): Promise<any>;
  getPlanByUser(userId: string): Promise<any | undefined>;

  // Meal Reminders
  createMealReminder(userId: string, reminder: InsertMealReminder): Promise<any>;
  getMealReminders(userId: string): Promise<any[]>;
  updateMealReminder(reminderId: string, updates: Partial<InsertMealReminder>): Promise<any>;
  deleteMealReminder(reminderId: string): Promise<void>;

  // Progress
  getProgressSummary(userId: string, week?: number): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<any | undefined> {
    return await User.findById(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return await User.findOne({ email: username });
  }

  async createUser(insertUser: InsertUser): Promise<any> {
    return await User.create(insertUser);
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<any> {
    return await User.findByIdAndUpdate(id, updates, { new: true });
  }

  async createWorkoutLog(userId: string, details: any): Promise<any> {
    return await WorkoutLog.create({ userId, details, completed: true });
  }

  async getWorkoutLogs(userId: string): Promise<any[]> {
    return await WorkoutLog.find({ userId }).sort({ date: -1 });
  }

  async createDietLog(userId: string, mealDetails: any, calories?: number): Promise<any> {
    return await DietLog.create({ userId, mealDetails, calories: calories || 0 });
  }

  async getDietLogs(userId: string): Promise<any[]> {
    return await DietLog.find({ userId }).sort({ date: -1 });
  }

  async createPlan(userId: string, workoutPlan: any, dietPlan: any): Promise<any> {
    return await Plan.create({ userId, weekStartDate: new Date(), workoutPlan, dietPlan });
  }

  async getPlanByUser(userId: string): Promise<any | undefined> {
    return await Plan.findOne({ userId }).sort({ weekStartDate: -1 });
  }

  async createMealReminder(userId: string, reminder: InsertMealReminder): Promise<any> {
    return await MealReminder.create({ ...reminder, userId });
  }

  async getMealReminders(userId: string): Promise<any[]> {
    return await MealReminder.find({ userId }).sort({ scheduledTime: 1 });
  }

  async updateMealReminder(reminderId: string, updates: Partial<InsertMealReminder>): Promise<any> {
    return await MealReminder.findByIdAndUpdate(reminderId, updates, { new: true });
  }

  async deleteMealReminder(reminderId: string): Promise<void> {
    await MealReminder.findByIdAndDelete(reminderId);
  }

  async getProgressSummary(userId: string, week?: number): Promise<any> {
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
