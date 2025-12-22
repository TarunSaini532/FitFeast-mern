import { z } from 'zod';
import { insertUserSchema, users, loginSchema, registerSchema, workoutLogs, dietLogs, plans } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  conflict: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/register',
      input: registerSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
        409: errorSchemas.conflict,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: loginSchema,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: {
        200: z.void(),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  user: {
    updateProfile: {
      method: 'PUT' as const,
      path: '/api/profile',
      input: insertUserSchema.partial(),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    }
  },
  ai: {
    generateWorkout: {
      method: 'POST' as const,
      path: '/api/ai/generate-workout',
      input: z.object({}).optional(),
      responses: {
        200: z.object({
          success: z.boolean(),
          data: z.object({
            week: z.number(),
            workoutPlan: z.array(z.any()),
          }),
          message: z.string(),
        }),
        401: errorSchemas.unauthorized,
      },
    },
    generateDiet: {
      method: 'POST' as const,
      path: '/api/ai/generate-diet',
      input: z.object({}).optional(),
      responses: {
        200: z.object({
          success: z.boolean(),
          data: z.object({
            dailyCalories: z.number(),
            macros: z.object({
              protein: z.number(),
              carbs: z.number(),
              fats: z.number(),
            }),
            mealPlan: z.array(z.any()),
            groceryList: z.array(z.string()),
          }),
          message: z.string(),
        }),
        401: errorSchemas.unauthorized,
      },
    },
    generateRecipe: {
      method: 'POST' as const,
      path: '/api/ai/generate-recipe',
      input: z.object({
        ingredients: z.array(z.string()),
        caloriesRange: z.object({ min: z.number(), max: z.number() }).optional(),
        dietType: z.string().optional(),
      }),
      responses: {
        200: z.object({
          success: z.boolean(),
          data: z.object({
            recipeName: z.string(),
            steps: z.array(z.string()),
            nutrition: z.object({
              calories: z.number(),
              protein: z.number(),
              carbs: z.number(),
              fats: z.number(),
            }),
          }),
          message: z.string(),
        }),
        401: errorSchemas.unauthorized,
      },
    },
    workoutFeedback: {
      method: 'POST' as const,
      path: '/api/ai/workout-feedback',
      input: z.object({
        workoutLogs: z.array(z.any()),
      }),
      responses: {
        200: z.object({
          success: z.boolean(),
          data: z.object({
            feedback: z.array(z.string()),
            encouragement: z.string(),
          }),
          message: z.string(),
        }),
        401: errorSchemas.unauthorized,
      },
    },
  },
  workouts: {
    log: {
      method: 'POST' as const,
      path: '/api/workouts/log',
      input: z.object({
        exercises: z.array(z.object({
          name: z.string(),
          sets: z.number().optional(),
          reps: z.number().optional(),
          weight: z.number().optional(),
          duration: z.number().optional(),
          caloriesBurned: z.number().optional(),
        })),
      }),
      responses: {
        201: z.custom<typeof workoutLogs.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  diets: {
    log: {
      method: 'POST' as const,
      path: '/api/diets/log',
      input: z.object({
        meals: z.array(z.object({
          name: z.string(),
          calories: z.number().optional(),
          protein: z.number().optional(),
          carbs: z.number().optional(),
          fats: z.number().optional(),
        })),
      }),
      responses: {
        201: z.custom<typeof dietLogs.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  progress: {
    summary: {
      method: 'GET' as const,
      path: '/api/progress/summary',
      input: z.object({
        week: z.number().optional(),
      }).optional(),
      responses: {
        200: z.object({
          success: z.boolean(),
          data: z.object({
            workoutStreak: z.number(),
            mealStreak: z.number(),
            consistency: z.number(),
            totalWorkouts: z.number(),
          }),
          message: z.string(),
        }),
        401: errorSchemas.unauthorized,
      },
    },
    disciplineScore: {
      method: 'GET' as const,
      path: '/api/progress/discipline-score',
      responses: {
        200: z.object({
          success: z.boolean(),
          data: z.object({
            score: z.number(),
            breakdown: z.object({
              workoutStreak: z.number(),
              mealStreak: z.number(),
              consistency: z.number(),
            }),
          }),
          message: z.string(),
        }),
        401: errorSchemas.unauthorized,
      },
    },
    groceryList: {
      method: 'GET' as const,
      path: '/api/progress/grocery-list',
      responses: {
        200: z.object({
          success: z.boolean(),
          data: z.object({
            items: z.array(z.string()),
            categories: z.record(z.array(z.string())),
          }),
          message: z.string(),
        }),
        401: errorSchemas.unauthorized,
      },
    },
  },
};

// ============================================
// HELPER
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
