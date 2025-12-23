import type { Express } from "express";
import { storage } from "../storage";
import { insertMealReminderSchema } from "@shared/schema";
import { z } from "zod";

function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

export function setupReminderRoutes(app: Express) {
  // Create meal reminder
  app.post("/api/reminders/meal", requireAuth, async (req, res) => {
    try {
      const input = insertMealReminderSchema.parse(req.body);
      const reminder = await storage.createMealReminder(req.user._id, input);
      res.status(201).json({
        success: true,
        data: reminder,
        message: "Reminder created successfully",
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json(err.errors);
      } else {
        res.status(500).json({ success: false, error: "Failed to create reminder" });
      }
    }
  });

  // Get all meal reminders for user
  app.get("/api/reminders/meal", requireAuth, async (req, res) => {
    try {
      const reminders = await storage.getMealReminders(req.user._id);
      res.json({
        success: true,
        data: reminders,
        message: "Reminders retrieved",
      });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to fetch reminders" });
    }
  });

  // Update meal reminder
  app.put("/api/reminders/meal/:id", requireAuth, async (req, res) => {
    try {
      const input = insertMealReminderSchema.partial().parse(req.body);
      const reminder = await storage.updateMealReminder(req.params.id, input);
      res.json({
        success: true,
        data: reminder,
        message: "Reminder updated",
      });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to update reminder" });
    }
  });

  // Delete meal reminder
  app.delete("/api/reminders/meal/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteMealReminder(req.params.id);
      res.json({
        success: true,
        message: "Reminder deleted",
      });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to delete reminder" });
    }
  });

  // Send reminder notification (manual trigger - can be called by background job)
  app.post("/api/reminders/send", async (req, res) => {
    try {
      const { userId, mealType } = req.body;
      
      // Simulate sending notification
      res.json({
        success: true,
        data: {
          notification: `Time for ${mealType}!`,
          message: `Your ${mealType.charAt(0).toUpperCase() + mealType.slice(1)} reminder has been sent!`,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to send reminder" });
    }
  });
}
