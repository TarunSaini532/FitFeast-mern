import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth (Phase 1)
  setupAuth(app, storage);

  // Profile Routes (Phase 1)
  app.put(api.user.updateProfile.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
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

  return httpServer;
}
