import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { api } from "@shared/routes";
import { z } from "zod";
import { generateAIContent, calculateDisciplineScore } from "./utils/aiLogic";
import { calculateBMR, calculateTDEE, calculateMacros } from "./utils/calorieCalculator";

// Middleware for protected routes
function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth (Phase 1)
  setupAuth(app, storage);

  // Profile Routes (Phase 1)
  app.put(api.user.updateProfile.path, requireAuth, async (req, res) => {
    try {
      const input = api.user.updateProfile.input.parse(req.body);
      const updatedUser = await storage.updateUser(req.user!.id, input);
      res.json(updatedUser);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json(err.errors);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // ============================================
  // PHASE 2: AI ROUTES
  // ============================================

  app.post(api.ai.generateWorkout.path, requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const aiData = await generateAIContent("workout", user);
      res.json({
        success: true,
        data: aiData.data,
        message: aiData.message,
      });

      // Create and save plan
      if (aiData.data) {
        await storage.createPlan(user.id, aiData.data, {});
      }
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to generate workout" });
    }
  });

  app.post(api.ai.generateDiet.path, requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      // Calculate macros
      const bmr = calculateBMR(user.age || 25, user.gender || "male", user.height || 180, user.weight || 80);
      const tdee = calculateTDEE(bmr, 1.55); // Moderate activity
      const macros = calculateMacros(tdee, user.goal || "maintenance");

      const aiData = await generateAIContent("diet", user);
      const dietData = {
        ...aiData.data,
        macros,
        tdee,
      };

      res.json({
        success: true,
        data: dietData,
        message: aiData.message,
      });

      // Save plan
      if (aiData.data) {
        const currentPlan = await storage.getPlanByUser(user.id);
        await storage.createPlan(user.id, currentPlan?.workoutPlan || {}, dietData);
      }
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to generate diet" });
    }
  });

  app.post(api.ai.generateRecipe.path, requireAuth, async (req, res) => {
    try {
      const input = api.ai.generateRecipe.input.parse(req.body);
      const user = await storage.getUser(req.user!.id);

      const aiData = await generateAIContent("recipe", user!, input);
      res.json({
        success: true,
        data: aiData.data,
        message: aiData.message,
      });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to generate recipe" });
    }
  });

  app.post(api.ai.workoutFeedback.path, requireAuth, async (req, res) => {
    try {
      const input = api.ai.workoutFeedback.input.parse(req.body);
      const feedbackOptions = [
        "Great job pushing hard! Your consistency is paying off.",
        "Excellent form! Try increasing weight next week.",
        "You're crushing it! Keep up this momentum.",
        "Strong performance! Your discipline score is up.",
        "Amazing dedication! Your streak is growing.",
      ];

      const feedback = feedbackOptions.sort(() => Math.random() - 0.5).slice(0, 3);

      res.json({
        success: true,
        data: {
          feedback,
          encouragement: "Keep grinding! Your efforts will compound.",
        },
        message: "Feedback generated!",
      });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to generate feedback" });
    }
  });

  // ============================================
  // PHASE 2: TRACKING ROUTES
  // ============================================

  app.post(api.workouts.log.path, requireAuth, async (req, res) => {
    try {
      const input = api.workouts.log.input.parse(req.body);
      const log = await storage.createWorkoutLog(req.user!.id, input.exercises);
      res.status(201).json(log);
    } catch (err) {
      res.status(500).json({ message: "Failed to log workout" });
    }
  });

  app.post(api.diets.log.path, requireAuth, async (req, res) => {
    try {
      const input = api.diets.log.input.parse(req.body);
      const totalCalories = input.meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
      const log = await storage.createDietLog(req.user!.id, input.meals, totalCalories);
      res.status(201).json(log);
    } catch (err) {
      res.status(500).json({ message: "Failed to log diet" });
    }
  });

  // ============================================
  // PHASE 2: PROGRESS ROUTES
  // ============================================

  app.get(api.progress.summary.path, requireAuth, async (req, res) => {
    try {
      const summary = await storage.getProgressSummary(req.user!.id, req.query.week ? parseInt(req.query.week as string) : undefined);
      res.json({
        success: true,
        data: summary,
        message: "Progress summary retrieved",
      });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to get progress" });
    }
  });

  app.get(api.progress.disciplineScore.path, requireAuth, async (req, res) => {
    try {
      const summary = await storage.getProgressSummary(req.user!.id);
      const score = calculateDisciplineScore(
        summary.workoutStreak,
        summary.mealStreak,
        summary.consistency
      );

      res.json({
        success: true,
        data: {
          score,
          breakdown: {
            workoutStreak: summary.workoutStreak * 0.4,
            mealStreak: summary.mealStreak * 0.3,
            consistency: summary.consistency * 0.3,
          },
        },
        message: "Discipline score calculated",
      });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to calculate score" });
    }
  });

  app.get(api.progress.groceryList.path, requireAuth, async (req, res) => {
    try {
      const plan = await storage.getPlanByUser(req.user!.id);
      const groceryList = plan?.dietPlan?.groceryList || [
        "Chicken breast",
        "Rice",
        "Broccoli",
        "Eggs",
        "Milk",
      ];

      const categories: { [key: string]: string[] } = {
        Proteins: ["Chicken breast", "Eggs", "Salmon"],
        Grains: ["Rice", "Oats", "Bread"],
        Vegetables: ["Broccoli", "Spinach", "Carrots"],
        Dairy: ["Milk", "Yogurt", "Cheese"],
      };

      res.json({
        success: true,
        data: {
          items: groceryList,
          categories,
        },
        message: "Grocery list retrieved",
      });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to get grocery list" });
    }
  });

  return httpServer;
}
